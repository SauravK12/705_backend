from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import mediapipe as mp
import math
import numpy as np
import torch
from PIL import Image
from torchvision import transforms
import base64
import io
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
QUESTION_VIDEOS_FOLDER = 'question_videos'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'webm'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)
os.makedirs(QUESTION_VIDEOS_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULT_FOLDER'] = RESULT_FOLDER
app.config['QUESTION_VIDEOS_FOLDER'] = QUESTION_VIDEOS_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

# Initialize model and face mesh
mp_face_mesh = mp.solutions.face_mesh
name = '0_66_49_wo_gl'
pth_model = torch.jit.load(f'torchscript_model_{name}.pth')
pth_model.eval()
DICT_EMO = {0: 'Neutral', 1: 'Happiness', 2: 'Sadness', 3: 'Surprise', 4: 'Fear', 5: 'Disgust', 6: 'Anger'}


# Helper functions
def pth_processing(fp):
    class PreprocessInput(torch.nn.Module):
        def __init__(self):
            super(PreprocessInput, self).__init__()

        def forward(self, x):
            x = x.to(torch.float32)
            x = torch.flip(x, dims=(0,))
            x[0, :, :] -= 91.4953
            x[1, :, :] -= 103.8827
            x[2, :, :] -= 131.0912
            return x

    def get_img_torch(img):
        ttransform = transforms.Compose([
            transforms.PILToTensor(),
            PreprocessInput()
        ])
        img = img.resize((224, 224), Image.Resampling.NEAREST)
        img = ttransform(img)
        img = torch.unsqueeze(img, 0)
        return img

    return get_img_torch(fp)


def norm_coordinates(normalized_x, normalized_y, image_width, image_height):
    x_px = min(math.floor(normalized_x * image_width), image_width - 1)
    y_px = min(math.floor(normalized_y * image_height), image_height - 1)
    return x_px, y_px


def get_box(fl, w, h):
    idx_to_coors = {}
    for idx, landmark in enumerate(fl.landmark):
        landmark_px = norm_coordinates(landmark.x, landmark.y, w, h)
        if landmark_px:
            idx_to_coors[idx] = landmark_px
    x_min = np.min(np.asarray(list(idx_to_coors.values()))[:, 0])
    y_min = np.min(np.asarray(list(idx_to_coors.values()))[:, 1])
    endX = np.max(np.asarray(list(idx_to_coors.values()))[:, 0])
    endY = np.max(np.asarray(list(idx_to_coors.values()))[:, 1])
    (startX, startY) = (max(0, x_min), max(0, y_min))
    (endX, endY) = (min(w - 1, endX), min(h - 1, endY))
    return startX, startY, endX, endY


def display_EMO_PRED(img, box, label='', line_width=2):
    lw = line_width or max(round(sum(img.shape) / 2 * 0.003), 2)
    text2_color = (255, 0, 255)
    p1, p2 = (int(box[0]), int(box[1])), (int(box[2]), int(box[3]))
    cv2.rectangle(img, p1, p2, text2_color, thickness=lw, lineType=cv2.LINE_AA)
    font = cv2.FONT_HERSHEY_SIMPLEX
    tf = max(lw - 1, 1)
    text_fond = (0, 0, 0)
    text_width_2, text_height_2 = cv2.getTextSize(label, font, lw / 3, tf)
    text_width_2 = text_width_2[0] + round(((p2[0] - p1[0]) * 10) / 360)
    center_face = p1[0] + round((p2[0] - p1[0]) / 2)
    cv2.putText(img, label,
                (center_face - round(text_width_2 / 2), p1[1] - round(((p2[0] - p1[0]) * 20) / 360)), font,
                lw / 3, text_fond, thickness=tf, lineType=cv2.LINE_AA)
    cv2.putText(img, label,
                (center_face - round(text_width_2 / 2), p1[1] - round(((p2[0] - p1[0]) * 20) / 360)), font,
                lw / 3, text2_color, thickness=tf, lineType=cv2.LINE_AA)
    return img


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# API Endpoints
@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'Emotion Recognition API',
        'version': '1.0',
        'endpoints': {
            'health': '/api/health',
            'analyze_frame': '/api/analyze-frame (POST)',
            'analyze_video': '/api/analyze-video (POST)',
            'download': '/api/download/<filename> (GET)',
            'emotions': '/api/emotions (GET)'
        }
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if the API is running"""
    return jsonify({'status': 'healthy', 'message': 'Emotion Recognition API is running'})


@app.route('/api/analyze-frame', methods=['POST'])
def analyze_frame():
    """Analyze a single frame (base64 encoded image)"""
    try:
        data = request.json
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        # Decode base64 image
        image_data = base64.b64decode(data['image'].split(',')[1] if ',' in data['image'] else data['image'])
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        h, w = frame.shape[:2]
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results_list = []

        with mp_face_mesh.FaceMesh(
                max_num_faces=5,
                refine_landmarks=False,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5) as face_mesh:

            results = face_mesh.process(frame_rgb)

            if results.multi_face_landmarks:
                for fl in results.multi_face_landmarks:
                    startX, startY, endX, endY = get_box(fl, w, h)
                    cur_face = frame_rgb[startY:endY, startX:endX]

                    if cur_face.size > 0:
                        cur_face_tensor = pth_processing(Image.fromarray(cur_face))
                        output = torch.nn.functional.softmax(pth_model(cur_face_tensor), dim=1).cpu().detach().numpy()
                        cl = np.argmax(output)
                        confidence = float(output[0][cl])
                        label = DICT_EMO[cl]

                        # Draw on frame
                        frame = display_EMO_PRED(frame, (startX, startY, endX, endY), label, line_width=3)

                        results_list.append({
                            'emotion': label,
                            'confidence': confidence,
                            'box': [int(startX), int(startY), int(endX), int(endY)],
                            'probabilities': {DICT_EMO[i]: float(output[0][i]) for i in range(len(DICT_EMO))}
                        })

        # Encode processed frame
        _, buffer = cv2.imencode('.jpg', frame)
        processed_image = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            'success': True,
            'faces': results_list,
            'processed_image': f'data:image/jpeg;base64,{processed_image}'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analyze-video', methods=['POST'])
def analyze_video():
    """Analyze an uploaded video file"""
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400

        file = request.files['video']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed types: mp4, avi, mov, webm'}), 400

        filename = secure_filename(file.filename)
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(input_path)

        # Process video
        output_filename = f'processed_{filename}'
        output_path = os.path.join(app.config['RESULT_FOLDER'], output_filename)

        cap = cv2.VideoCapture(input_path)
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)

        vid_writer = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))

        frame_emotions = []

        with mp_face_mesh.FaceMesh(
                max_num_faces=1,
                refine_landmarks=False,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5) as face_mesh:

            frame_count = 0
            while cap.isOpened():
                success, frame = cap.read()
                if not success:
                    break

                frame_copy = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = face_mesh.process(frame_copy)

                if results.multi_face_landmarks:
                    for fl in results.multi_face_landmarks:
                        startX, startY, endX, endY = get_box(fl, w, h)
                        cur_face = frame_copy[startY:endY, startX:endX]

                        if cur_face.size > 0:
                            cur_face_tensor = pth_processing(Image.fromarray(cur_face))
                            output = torch.nn.functional.softmax(pth_model(cur_face_tensor),
                                                                 dim=1).cpu().detach().numpy()
                            cl = np.argmax(output)
                            label = DICT_EMO[cl]

                            frame = display_EMO_PRED(frame, (startX, startY, endX, endY), label, line_width=3)
                            frame_emotions.append({'frame': frame_count, 'emotion': label})

                vid_writer.write(frame)
                frame_count += 1

        vid_writer.release()
        cap.release()

        # Calculate emotion statistics
        emotion_counts = {}
        for fe in frame_emotions:
            emotion_counts[fe['emotion']] = emotion_counts.get(fe['emotion'], 0) + 1

        return jsonify({
            'success': True,
            'output_file': output_filename,
            'total_frames': frame_count,
            'frames_with_faces': len(frame_emotions),
            'emotion_statistics': emotion_counts,
            'download_url': f'/api/download/{output_filename}'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download processed video"""
    try:
        file_path = os.path.join(app.config['RESULT_FOLDER'], filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/emotions', methods=['GET'])
def get_emotions():
    """Get list of available emotions"""
    return jsonify({'emotions': list(DICT_EMO.values())})


@app.route('/api/save-question-video', methods=['POST'])
def save_question_video():
    """Save video recording for a specific question with emotion data"""
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400

        video_file = request.files['video']
        question_id = request.form.get('questionId')
        emotion = request.form.get('emotion', 'Unknown')
        emotion_data = request.form.get('emotionData', '[]')
        session_id = request.form.get('sessionId')  # Get session ID from client

        if not question_id:
            return jsonify({'error': 'Question ID is required'}), 400

        # Create or use existing session folder
        import time
        import json

        if not session_id:
            # Create new session if not provided
            session_id = str(int(time.time()))

        session_folder = os.path.join(app.config['QUESTION_VIDEOS_FOLDER'], session_id)
        os.makedirs(session_folder, exist_ok=True)

        # Save video file
        filename = f'question_{question_id}_{emotion}.mp4'
        video_path = os.path.join(session_folder, filename)
        video_file.save(video_path)

        # Save emotion data to JSON file
        emotion_filename = f'question_{question_id}_emotions.json'
        emotion_path = os.path.join(session_folder, emotion_filename)

        with open(emotion_path, 'w') as f:
            json.dump({
                'questionId': question_id,
                'dominantEmotion': emotion,
                'emotionTimeline': json.loads(emotion_data) if emotion_data else []
            }, f, indent=2)

        return jsonify({
            'success': True,
            'message': 'Video saved successfully',
            'sessionId': session_id,
            'videoPath': video_path,
            'emotionPath': emotion_path,
            'dominantEmotion': emotion
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)