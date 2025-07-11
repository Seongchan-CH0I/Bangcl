# 데이터베이스 테이블 구조 설계

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class PostImage(Base):
    """게시글 이미지 모델"""
    __tablename__ = "post_images"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), nullable=False)
    caption = Column(Text, nullable=True)
    post_id = Column(Integer, ForeignKey("posts.id"))

    post = relationship("DBPost", back_populates="images")

    def __repr__(self):
        return f"<PostImage(id={self.id}, url='{self.url}')>"

class DBPost(Base):
    """게시글 모델"""
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    summary = Column(Text, nullable=True)
    thumbnail_image_url = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # 게시글을 공유했을 때의 시각
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) # 게시글을 수정했을 때의 시각
    author_username = Column(String(50), nullable=False) # Add author_username

    images = relationship("PostImage", back_populates="post", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Post(id={self.id}, title='{self.title}')>"

class User(Base):
    """사용자 모델"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # 게시글을 공유했을 때의 시각
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) # 게시글을 수정했을 때의 시각

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>" 