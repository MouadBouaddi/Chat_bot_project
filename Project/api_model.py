from fastapi import FastAPI
from pydantic import BaseModel
from my_model import chat, history, cln_history
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
import warnings
warnings.filterwarnings('ignore')


class Item(BaseModel):
    Query: str

@app.get('/')
def main():
    return "Welcome to my API Chatbot"
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get_answer")
def get_answer(message: str,author: int, date: str):
    return chat({"message":message,"author": author, "date": date})

@app.get("/get_history")
def get_history():
    return history()

@app.get("/clean_history")
def clean_history():
    cln_history()