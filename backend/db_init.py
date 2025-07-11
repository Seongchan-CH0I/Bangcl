# 데이터베이스 초기화 스크립트, MySQL 데이터베이스 연결 테스트 및 초기 설정

import pymysql
from config import DatabaseConfig
from database import init_db, Base, engine
import models # models 모듈 임포트 추가 # engine 임포트 추가
import sys

def test_connection():
    """데이터베이스 연결 테스트"""
    try:
        # 연결 파라미터 가져오기
        params = DatabaseConfig.get_connection_params()
        
        print("데이터베이스 연결 테스트 중...")
        print(f"   호스트: {params['host']}")
        print(f"   포트: {params['port']}")
        print(f"   사용자: {params['user']}")
        print(f"   데이터베이스: {params['database']}")
        
        # 연결 테스트
        connection = pymysql.connect(**params)
        
        # 연결 성공 확인
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"MySQL 연결 성공! 버전: {version[0]}")
        
        connection.close()
        return True
        
    except pymysql.Error as e:
        print(f"MySQL 연결 실패: {e}")
        print("\n 문제 해결 방법:")
        print("1. MySQL 서버가 실행 중인지 확인하세요")
        print("2. 데이터베이스가 존재하는지 확인하세요")
        print("3. 사용자 권한을 확인하세요")
        print("4. config.py 또는 환경 변수에서 연결 정보를 확인하세요")
        return False
    except Exception as e:
        print("예상치 못한 오류: {e}")
        return False

def create_database_if_not_exists():
    """데이터베이스가 없으면 생성"""
    try:
        params = DatabaseConfig.get_connection_params()
        db_name = params.pop('database')  # 데이터베이스 이름 제거
        
        # MySQL 서버에 연결 (특정 데이터베이스 없이)
        connection = pymysql.connect(**params)
        
        with connection.cursor() as cursor:
            # 데이터베이스 존재 여부 확인
            cursor.execute(f"SHOW DATABASES LIKE '{db_name}'")
            result = cursor.fetchone()
            
            if not result:
                print(f"데이터베이스 '{db_name}' 생성 중...")
                cursor.execute(f"CREATE DATABASE {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                print(f"데이터베이스 '{db_name}' 생성 완료!")
            else:
                print(f"데이터베이스 '{db_name}' 이미 존재합니다")
        
        connection.close()
        return True
        
    except Exception as e:
        print(f"데이터베이스 생성 실패: {e}")
        return False

def init_tables():
    """테이블 초기화"""
    try:
        print("테이블 초기화 중...")
        init_db()
        print("테이블 초기화 완료!")

        # 테이블 생성 확인 로직 추가
        print("생성된 테이블 확인 중...")
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        expected_tables = [table.name for table in Base.metadata.sorted_tables]
        
        all_tables_exist = True
        for table_name in expected_tables:
            if table_name not in existing_tables:
                print(f"경고: 테이블 '{table_name}'이(가) 생성되지 않았습니다.")
                all_tables_exist = False
            else:
                print(f"정보: 테이블 \'{table_name}'이(가) 존재합니다.")
        
        if all_tables_exist:
            print("모든 예상 테이블이 성공적으로 생성되었습니다.")
        else:
            print("일부 테이블이 생성되지 않았습니다. 오류를 확인하세요.")

        return True
    except Exception as e:
        print(f"테이블 초기화 실패: {e}")
        return False

def main():
    """메인 함수"""
    print("Bangcl 프로젝트 데이터베이스 초기화")
    print("=" * 50)
    
    # 1. 데이터베이스 생성 (필요시)
    if not create_database_if_not_exists():
        sys.exit(1)
    
    # 2. 연결 테스트
    if not test_connection():
        sys.exit(1)
    
    # 3. 테이블 초기화
    if not init_tables():
        sys.exit(1)
    
    print("\n데이터베이스 초기화 완료!")
    print("이제 FastAPI 서버를 실행할 수 있습니다:")
    print("   uvicorn main:app --reload")

if __name__ == "__main__":
    from sqlalchemy import inspect # inspect 임포트
    main() 