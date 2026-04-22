# Math Solver AI

A production-ready full-stack AI web application featuring a ChatGPT-style interface with a premium glassmorphism design and real-time word-by-word streaming from the Gemini 2.5 Flash model.

## Features

- **Real-time AI Streaming**: Uses WebSockets to stream the Gemini model's response for a seamless typing effect.
- **Premium UI/UX**: Designed with React and vanilla CSS, featuring deep dark gradients, animated background blobs, glassmorphism panels, and smooth fade-in animations.
- **FastAPI Backend**: High-performance asynchronous Python backend to handle WebSocket connections and model integration.

## Project Structure

- `frontend/`: The React (Vite) frontend application.
- `backend/`: The FastAPI backend application.

## Prerequisites

- Node.js
- Python 3.9+
- A Google Gemini API Key

## Setup & Running Locally

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your API Key:
   Open `backend/.env` and replace `your_gemini_api_key_here` with your actual Gemini API Key.
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```
4. Start the backend server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployment Notes

- **Frontend**: Can be easily deployed to Vercel by pushing the `frontend/` directory.
- **Backend**: Can be deployed to Render or Railway. Make sure to set the `GEMINI_API_KEY` as an environment variable in your deployment platform's dashboard.

## Credits

MUHAMMED RISHAN 10-E • EHAN AL AMISH 10-E
