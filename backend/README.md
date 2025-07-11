# Bangcl Backend

FastAPI와 MySQL을 사용한 백엔드 API 서버입니다.

## 🚀 시작하기

### 1. 환경 설정

#### MySQL 설치 및 설정
1. MySQL 서버를 설치하고 실행합니다
2. 데이터베이스와 사용자를 생성합니다:

```sql
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bangcl_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON mydb.* TO 'bangcl_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Python 환경 설정
```bash
cd backend
pip install -r requirements.txt
```

### 2. 환경 변수 설정

`backend/.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=thffkqla159
DB_NAME=mydb

# Application Configuration
APP_HOST=0.0.0.0
APP_PORT=8000
DEBUG=True
```

### 3. 데이터베이스 초기화

```bash
cd backend
python db_init.py
```

### 4. 서버 실행

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🗄️ 데이터베이스 구조

### Posts 테이블
- `id`: Primary Key (Auto Increment)
- `title`: 게시글 제목 (VARCHAR(255))
- `content`: 게시글 내용 (TEXT)
- `imageUrl`: 이미지 URL (VARCHAR(500), NULL 허용)
- `created_at`: 생성 시간 (TIMESTAMP)
- `updated_at`: 수정 시간 (TIMESTAMP)

### Users 테이블
- `id`: Primary Key (Auto Increment)
- `username`: 사용자명 (VARCHAR(50), UNIQUE)
- `email`: 이메일 (VARCHAR(100), UNIQUE)
- `hashed_password`: 해시된 비밀번호 (VARCHAR(255))
- `created_at`: 생성 시간 (TIMESTAMP)
- `updated_at`: 수정 시간 (TIMESTAMP)

## 🔧 주요 기능

### 게시글 관리
- `POST /share-post`: 새 게시글 생성
- `GET /get-posts`: 모든 게시글 조회
- `GET /posts/{post_id}`: 특정 게시글 조회
- `PUT /posts/{post_id}`: 게시글 수정
- `DELETE /posts/{post_id}`: 게시글 삭제

### 사용자 관리
- `POST /users`: 새 사용자 생성
- `GET /users`: 모든 사용자 조회

### 헬스 체크
- `GET /`: 루트 엔드포인트
- `GET /health`: 헬스 체크

## 🛠️ 개발 도구

### 프로젝트 구조
```
backend/
├── main.py          # FastAPI 앱 메인 파일
├── config.py        # 설정 관리
├── database.py      # 데이터베이스 연결
├── models.py        # SQLAlchemy 모델
├── schemas.py       # Pydantic 스키마
├── db_init.py       # 데이터베이스 초기화 스크립트
├── requirements.txt # Python 의존성
└── README.md        # 이 파일
```

### 주요 라이브러리
- **FastAPI**: 웹 프레임워크
- **SQLAlchemy**: ORM
- **PyMySQL**: MySQL 드라이버
- **Pydantic**: 데이터 검증
- **python-dotenv**: 환경 변수 관리

## 🔍 문제 해결

### 연결 오류
1. MySQL 서버가 실행 중인지 확인
2. 데이터베이스와 사용자가 올바르게 생성되었는지 확인
3. 환경 변수 설정을 확인
4. 방화벽 설정 확인

### 권한 오류
```sql
GRANT ALL PRIVILEGES ON mydb.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### 포트 충돌
다른 포트로 실행:
```bash
uvicorn main:app --reload --port 8001
```

## 📝 환경 변수

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| DB_HOST | localhost | MySQL 호스트 |
| DB_PORT | 3306 | MySQL 포트 |
| DB_USER | root | MySQL 사용자 |
| DB_PASSWORD | password | MySQL 비밀번호 |
| DB_NAME | mydb | 데이터베이스 이름 |
| APP_HOST | 0.0.0.0 | 애플리케이션 호스트 |
| APP_PORT | 8000 | 애플리케이션 포트 |
| DEBUG | True | 디버그 모드 | 