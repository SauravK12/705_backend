# Webcam & Emotion Detection Integration Guide

## Overview
This integration enables real-time emotion detection and video recording for each questionnaire question. Videos are saved with emotion data in organized folders.

## Features Implemented

### 1. **Real-time Emotion Detection**
- Captures webcam frames every 500ms during each question
- Sends frames to Flask API for emotion analysis
- Displays current detected emotion in the UI

### 2. **Video Recording Per Question**
- Records video for each individual question
- Automatically stops and saves when moving to next question
- Saves videos with emotion label in filename

### 3. **Emotion Data Tracking**
- Tracks emotion timeline with timestamps
- Calculates dominant emotion for each question
- Saves emotion data as JSON alongside video

### 4. **Session Management**
- All videos from one user session saved in same folder
- Folder structure: `question_videos/{sessionId}/`
- Each question creates:
  - `question_{id}_{emotion}.webm` - video file
  - `question_{id}_emotions.json` - emotion timeline

## API Endpoints

### `/api/analyze-frame` (POST)
Analyzes a single frame for emotion detection.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "faces": [{
    "emotion": "Happiness",
    "confidence": 0.95,
    "box": [x1, y1, x2, y2],
    "probabilities": {...}
  }],
  "processed_image": "data:image/jpeg;base64,..."
}
```

### `/api/save-question-video` (POST)
Saves video with emotion data for a question.

**Request (FormData):**
- `video`: WebM video file
- `questionId`: Question identifier
- `emotion`: Dominant emotion
- `emotionData`: JSON string of emotion timeline
- `sessionId`: (optional) Session identifier

**Response:**
```json
{
  "success": true,
  "sessionId": "1696250000",
  "videoPath": "question_videos/1696250000/question_1_Happiness.webm",
  "emotionPath": "question_videos/1696250000/question_1_emotions.json",
  "dominantEmotion": "Happiness"
}
```

## File Structure

```
705_backend/
├── API.py                          # Flask backend with endpoints
├── question_videos/                # Saved videos folder
│   └── {sessionId}/               # Each session gets unique folder
│       ├── question_1_Happiness.webm
│       ├── question_1_emotions.json
│       ├── question_2_Neutral.webm
│       └── question_2_emotions.json
└── client/
    └── src/
        └── pages/
            └── QuestionnairePage.jsx  # Updated with recording logic
```

## Setup & Testing

### 1. Start Flask Backend
```bash
cd /Users/Dharm/705_backend
python API.py
```
Backend runs on `http://localhost:5000`

### 2. Start React Frontend
```bash
cd /Users/Dharm/705_backend/client
npm run dev
```
Frontend runs on `http://localhost:5173` (or configured port)

### 3. Testing Flow
1. Navigate to `/facecam-preview` to enable camera
2. Go to `/questionnaire` to start survey
3. Answer each question - video records automatically
4. Check `question_videos/{sessionId}/` folder for saved videos
5. Each question creates a video file and emotion JSON

## Emotion Detection Available

The system detects 7 emotions:
- Neutral
- Happiness
- Sadness
- Surprise
- Fear
- Disgust
- Anger

## How It Works

### Frontend (QuestionnairePage.jsx)

1. **Camera Initialization**
   - Requests webcam access on mount
   - Starts recording immediately

2. **Frame Capture Loop**
   - Every 500ms: captures frame from video element
   - Converts to base64 and sends to API
   - Receives emotion prediction
   - Stores in emotion timeline

3. **Video Recording**
   - Uses MediaRecorder API
   - Records in WebM format (VP9 codec)
   - Chunks collected every 100ms

4. **Question Transition**
   - On "Next": stops recording
   - Calculates dominant emotion
   - Sends video + emotion data to API
   - Starts new recording for next question

5. **Session Persistence**
   - First video save returns sessionId
   - All subsequent videos use same sessionId
   - Keeps all user videos organized together

### Backend (API.py)

1. **Frame Analysis**
   - Receives base64 image
   - Uses MediaPipe for face detection
   - PyTorch model predicts emotion
   - Returns emotion with confidence

2. **Video Storage**
   - Creates session folder if new
   - Saves WebM video file
   - Saves emotion JSON with timeline
   - Returns paths and session info

## Troubleshooting

### Camera not working
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browser

### API errors
- Verify Flask server is running
- Check CORS is enabled
- Confirm model file exists

### Videos not saving
- Check `question_videos/` folder exists
- Verify write permissions
- Check Flask logs for errors

### Emotion detection not working
- Ensure face is visible and well-lit
- Check MediaPipe can detect face
- Verify PyTorch model is loaded

## Notes

- Videos saved in WebM format (browser compatible)
- Session ID uses Unix timestamp
- Emotion data includes full timeline with timestamps
- API supports up to 100MB video files
- CORS enabled for local development
