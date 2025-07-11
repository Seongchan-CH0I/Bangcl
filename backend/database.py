# 데이터베이스 연결 설정

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DatabaseConfig

# 데이터베이스 URL 생성
DATABASE_URL = DatabaseConfig.get_database_url()

# SQLAlchemy 엔진 생성
# MySQL 연결 설정 최적화
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # 연결 상태 확인
    pool_recycle=3600,   # 1시간마다 연결 재생성
    pool_size=10,        # 연결 풀 크기
    max_overflow=20,     # 최대 오버플로우 연결 수
    echo=False           # SQL 쿼리 로깅 (개발 시 True로 설정)
)

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 생성 (모델 정의에 사용)
Base = declarative_base()

def get_db():
    """데이터베이스 세션 의존성 주입 함수"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """데이터베이스 초기화 (테이블 생성)"""
    Base.metadata.drop_all(bind=engine) # Base.meatadata에 있는 모든 테이블 삭제
    Base.metadata.create_all(bind=engine) # Base.meatadata에 있는 모든 테이블 생성