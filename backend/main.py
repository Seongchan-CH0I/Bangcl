from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:3000",  # Next.js 개발 서버 주소
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Post(BaseModel):
    title: str
    content: str
    imageUrl: str = None

# 임시 데이터 저장소
posts_db: List[Post] = []

@app.post("/share-post")
async def share_post(post: Post):
    posts_db.append(post)
    return {"message": "Post shared successfully", "post": post}

@app.get("/get-posts")
async def get_posts():
    return {"posts": posts_db}

@app.get("/")
async def read_root():
    return {"message": "FastAPI backend is running!"}
