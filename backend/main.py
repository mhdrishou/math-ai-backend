import os
import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from mistralai.client import Mistral
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Mistral
api_key = os.getenv("MISTRAL_API_KEY")
if api_key:
    client = Mistral(api_key=api_key)
else:
    print("Warning: MISTRAL_API_KEY not found in environment variables.")
    client = None

@app.get("/")
def read_root():
    return {"status": "Math Solver AI Backend Running (Mistral AI)"}

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    if not client:
        await websocket.send_json({"error": "Mistral API key not configured on backend."})
        await websocket.close()
        return

    # Keep track of message history for the session
    messages = [
        {"role": "system", "content": "You are a helpful math solver AI assistant."}
    ]

    try:
        while True:
            # Receive message from frontend
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data.get("message", "")

            if not user_message:
                continue
            
            messages.append({"role": "user", "content": user_message})

            try:
                # Call Mistral API with streaming
                response_stream = await client.chat.stream_async(
                    model="mistral-large-latest",
                    messages=messages,
                )
                
                full_response = ""
                async for chunk in response_stream:
                    if chunk.data.choices and chunk.data.choices[0].delta and chunk.data.choices[0].delta.content:
                        content_chunk = chunk.data.choices[0].delta.content
                        full_response += content_chunk
                        # Send chunk to frontend
                        await websocket.send_json({"chunk": content_chunk})
                        # Small sleep to ensure chunks are sent reliably
                        await asyncio.sleep(0.01)
                
                # Append AI response to history
                messages.append({"role": "assistant", "content": full_response})
                
                # Signal end of message
                await websocket.send_json({"done": True})
            except Exception as e:
                print(f"Error calling Mistral: {e}")
                await websocket.send_json({"error": str(e)})
                
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
