import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class DatabaseConfig:
    """데이터베이스 설정 클래스"""

    # 기본값 설정
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = int(os.getenv("DB_PORT", 3306))
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "thffkqla159")
    DB_NAME = os.getenv("DB_NAME", "mydb")
    
    @classmethod
    def get_database_url(cls):
        """데이터베이스 URL 생성"""
        return f"mysql+pymysql://{cls.DB_USER}:{cls.DB_PASSWORD}@{cls.DB_HOST}:{cls.DB_PORT}/{cls.DB_NAME}"
    
    @classmethod
    def get_connection_params(cls):
        """데이터베이스 연결 파라미터 반환"""
        return {
            "host": cls.DB_HOST,
            "port": cls.DB_PORT,
            "user": cls.DB_USER,
            "password": cls.DB_PASSWORD,
            "database": cls.DB_NAME,
        }

class AppConfig:
    """애플리케이션 설정 클래스"""
    
    APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT = int(os.getenv("APP_PORT", 8000))
    DEBUG = os.getenv("DEBUG", "True").lower() == "true" 