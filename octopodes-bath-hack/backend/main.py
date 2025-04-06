from fastapi import FastAPI, Depends
from node import Game
from pydantic import BaseModel
from typing import List, Union
from fastapi.middleware.cors import CORSMiddleware

# Define the models for request validation
class StartRequest(BaseModel):
    locations: List[List[Union[str, List[str]]]]
    characters: List[List[str]]

game = Game()
def get_game():
   return game

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/start")
def start(request: StartRequest, instance: Game = Depends(get_game)):
    return instance.start(request.locations, request.characters)

@app.post("/move")
def move(x: int, y: int, instance: Game = Depends(get_game)):
    return instance.move(x, y)
    