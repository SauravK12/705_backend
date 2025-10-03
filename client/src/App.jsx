import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage, SummaryPage, QuestionnairePage, ReviewPage, ConsentPage, FacecamPreviewPage, CompletionPage, ErrorPage, Root } from './pages'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "summary",
        element: <SummaryPage />,
      },
      {
        path: "questionnaire",
        element: <QuestionnairePage />,
      },
      {
        path: "consent",
        element: <ConsentPage />,
      },
      {
        path: "facecam-preview",
        element: <FacecamPreviewPage />,
      },
      {
        path: "review",
        element: <ReviewPage />,
      },
      {
        path: "completion",
        element: <CompletionPage />,
      },
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App