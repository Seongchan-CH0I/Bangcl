# API를 통해 오고 가는 데이터의 형식 설계

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# PostImage 관련 스키마
class PostImageBase(BaseModel):
    url: str
    caption: Optional[str] = None

class PostImageCreate(PostImageBase):
    pass

class PostImage(PostImageBase):
    id: int
    post_id: int

    class Config:
        from_attributes = True


# Post 관련 스키마
class PostBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    thumbnail_image_url: Optional[str] = None

class PostCreate(PostBase):
    images: List[PostImageCreate] = []
    author_username: str

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    images: Optional[List[PostImageCreate]] = None

class Post(PostBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    images: List[PostImage] = []
    author_username: str

    class Config:
        from_attributes = True


# User 관련 스키마
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# 응답 스키마
class MessageResponse(BaseModel):
    message: str
    success: bool = True

class LoginResponse(BaseModel):
    username: str 