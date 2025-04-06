from fastapi import FastAPI, Depends
from node import Game
from pydantic import BaseModel
from typing import List, Union
from fastapi.middleware.cors import CORSMiddleware

# Define the model
class ComplexList(BaseModel):
    data: List[Union[str, List[str]]]

game = Game()
def get_game():
   return game

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  # Allow all headers
)

@app.post("/start")
def start(locations : List[List[Union[str, List[str]]]], characters : list[list[str]], instance: Game = Depends(get_game)):
    return {instance.start(locations, characters)}
@app.get("/move")
def move(x: int, y: int, instance: Game = Depends(get_game)):
    return {instance.move(x, y)}
    