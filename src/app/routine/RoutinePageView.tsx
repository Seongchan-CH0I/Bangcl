'use client';

import { useRef, useState } from 'react';
import HomeNavBar from '../home/HomeNavBar';
import styles from './RoutinePageView.module.css';
import LoginPageView from '../login/_features/ui/LoginPageView';

interface RoutineImage {
  file: File;
  url: string;
  desc: string;
}

interface Post {
  title: string;
  content: string;
  imageUrl?: string;
}

export default function RoutinePageView() {
  const [images, setImages] = useState<RoutineImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const toggleLoginView = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, { file, url, desc: '' }]);
    }
  };

  const handleDescChange = (idx: number, value: string) => {
    setImages((prev) => prev.map((img, i) => i === idx ? { ...img, desc: value } : img));
  };

  const handleShare = async () => {
    if (images.length === 0) {
      alert('공유할 사진을 추가해주세요.');
      return;
    }

    const postData: Post = {
      title: "새로운 루틴 게시물", // 예시 제목
      content: images.map(img => img.desc).join("\n"), // 모든 사진 설명을 합쳐서 내용으로
      imageUrl: images.length > 0 ? images[0].url : undefined, // 첫 번째 사진의 URL을 이미지로 사용
    };

    try {
      const response = await fetch('http://localhost:8000/share-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert('게시물이 성공적으로 공유되었습니다!');
        // 공유 성공 후 필요한 로직 (예: 이미지 초기화, 페이지 이동 등)
        setImages([]);
      } else {
        alert('게시물 공유에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시물 공유 중 오류 발생:', error);
      alert('게시물 공유 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.bg}>
      <HomeNavBar onRoomClick={toggleLoginView} />
      <div className={styles.topBar}>
        <button className={styles.shareBtn} onClick={handleShare}>공유하기</button>
      </div>
      <div className={styles.tabBar}>
        <span className={styles.tabActive}>사진</span>
      </div>
      <div className={styles.uploadArea}>
        {images.length === 0 && (
          <div className={styles.addBox} onClick={handleAddImage}>
            <span className={styles.addIcon}>+</span>
            <span>사진 추가</span>
          </div>
        )}
        {images.map((img, idx) => (
          <div className={styles.imgBlock} key={idx}>
            <div className={styles.imgRow}>
              <img src={img.url} alt={`업로드 사진 ${idx+1}`} className={styles.uploadImg} />
              <textarea
                className={styles.imgDesc}
                placeholder="사진 설명"
                value={img.desc}
                onChange={e => handleDescChange(idx, e.target.value)}
              />
            </div>
            <button className={styles.addBtn} onClick={handleAddImage}>사진 추가</button>
          </div>
        ))}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      {isLoginVisible && <LoginPageView onLoginSuccess={toggleLoginView} />}
    </div>
  );
}
