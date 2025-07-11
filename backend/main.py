from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from sqlalchemy.orm import Session
from typing import List
from passlib.context import CryptContext

# 로컬 모듈 임포트
from database import get_db, init_db
from models import DBPost, User, PostImage
from schemas import PostCreate, Post, UserCreate, User as UserSchema, MessageResponse, UserLogin, LoginResponse
from config import AppConfig

# FastAPI 앱 인스턴스 생성
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(
    title="Bangcl API",
    description="Bangcl Backend API",
    version="1.0.0"
)

# 전역 예외 핸들러
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # In a real production environment, you should log the error.
    # import logging
    # logging.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )

# CORS 설정
origins = [
    "http://localhost:3000",  # Next.js 개발 서버 주소
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# 이미지 업로드 디렉토리 생성
UPLOAD_DIR = "static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 이미지 업로드 API Endpoint
@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    """이미지 업로드"""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"http://localhost:8000/static/images/{file.filename}"}

# 게시글 관련 API Endpoint
@app.post("/share-post", response_model=Post, status_code=status.HTTP_201_CREATED)
async def share_post(post: PostCreate, db: Session = Depends(get_db)):
    """새 게시글 생성"""
    try:
        db_post = DBPost(title=post.title, content=post.content, summary=post.summary,
                         thumbnail_image_url=post.thumbnail_image_url, author_username=post.author_username)
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        
        for image_data in post.images:
            db_image = PostImage(url=image_data.url, caption=image_data.caption,
                                 post_id=db_post.id)
            db.add(db_image)
        db.commit()
        db.refresh(db_post)
        
        return db_post
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"게시글 생성 중 오류가 발생했습니다: {str(e)}")

@app.get("/get-posts", response_model=List[Post])
async def get_posts(db: Session = Depends(get_db)):
    """모든 게시글 조회"""
    posts = db.query(DBPost).order_by(DBPost.created_at.desc()).all()
    for post in posts:
        if post.thumbnail_image_url and not post.thumbnail_image_url.startswith("http"):
            post.thumbnail_image_url = f"http://localhost:8000{post.thumbnail_image_url}"            
        for image in post.images:
            if image.url and not image.url.startswith("http"):
                image.url = f"http://localhost:8000{image.url}"
    return posts

@app.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: int, db: Session = Depends(get_db)):
    """특정 게시글 조회"""
    post = db.query(DBPost).filter(DBPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    
    post.author_username = post.author_username 

    if post.thumbnail_image_url and not post.thumbnail_image_url.startswith("http"):
        post.thumbnail_image_url = f"http://localhost:8000{post.thumbnail_image_url}"
    
    for image in post.images:
        if image.url and not image.url.startswith("http"):
            image.url = f"http://localhost:8000{image.url}"
        
    return post

@app.put("/posts/{post_id}", response_model=Post)
async def update_post(post_id: int, post_update: PostCreate, db: Session = Depends(get_db)):
    """게시글 수정"""
    db_post = db.query(DBPost).filter(DBPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    # Update basic fields from the request
    update_data = post_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field != "images":  # Skip images for now
            setattr(db_post, field, value)

    # Handle image updates separately
    if 'images' in update_data:
        # Clear existing images
        db.query(PostImage).filter(PostImage.post_id == post_id).delete()

        # Add new images
        for image_data in post_update.images:
            db_image = PostImage(
                url=image_data.url,
                caption=image_data.caption,
                post_id=post_id
            )
            db.add(db_image)

    try:
        db.commit()
        db.refresh(db_post)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"게시글 수정 중 오류가 발생했습니다: {str(e)}")

    return db_post

@app.delete("/posts/{post_id}", response_model=MessageResponse)
async def delete_post(post_id: int, db: Session = Depends(get_db)):
    """게시글 삭제"""
    db_post = db.query(DBPost).filter(DBPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    
    try:
        db.delete(db_post)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"게시글 삭제 중 오류가 발생했습니다: {str(e)}")

    return MessageResponse(message="게시글이 성공적으로 삭제되었습니다")

# User 관련 API Endpoint
@app.post("/users", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """새 사용자 생성"""
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 사용자명 또는 이메일입니다")
    
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"사용자 생성 중 오류가 발생했습니다: {str(e)}")

    return db_user

@app.post("/login", response_model=LoginResponse)
async def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """사용자 로그인"""
    user = db.query(User).filter(User.email == user_login.email).first()
    if not user or not pwd_context.verify(user_login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="잘못된 사용자명 또는 비밀번호입니다")
    return LoginResponse(username=user.username)

# 헬스 체크 엔드포인트
@app.get("/")
async def read_root():
    return {"message": "Bangcl FastAPI backend with MySQL is running!", "status": "healthy"}