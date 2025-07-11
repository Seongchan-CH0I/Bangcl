'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeNavBar from '../home/HomeNavBar';
import styles from './RoutinePageView.module.css';
import LoginPageView from '../login/_features/ui/LoginPageView';
import { useUserStore } from '../login/_entities/model/user-store';

interface RoutineImage {
  file: File;
  url: string;
  desc: string;
}

interface Post {
  title: string;
  content: string;
  summary?: string;
  thumbnail_image_url?: string;
  images?: { url: string; caption?: string }[];
  author_username: string; // Add author_username to Post interface
}

export default function RoutinePageView() {
  const [images, setImages] = useState<RoutineImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const router = useRouter();
  const { username } = useUserStore(); // Get username from store

  // New state for thumbnail and summary
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>(''); // New state for post title
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);


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

  // New handler for thumbnail file change
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setThumbnailFile(file);
      setThumbnailUrl(url);
    }
  };

  const handleDescChange = (idx: number, value: string) => {
    setImages((prev) => prev.map((img, i) => i === idx ? { ...img, desc: value } : img));
  };

  const handleShare = async () => {
    if (!username) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (images.length === 0 && !thumbnailFile) {
      alert('공유할 사진을 추가하거나 대표 사진을 추가해주세요.');
      return;
    }

    let uploadedThumbnailUrl: string | undefined;
    if (thumbnailFile) {
      const formData = new FormData();
      formData.append('file', thumbnailFile);
      try {
        const response = await fetch('http://localhost:8000/upload-image/', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('대표 이미지 업로드 실패');
        }
        const data = await response.json();
        uploadedThumbnailUrl = data.url;
      } catch (error) {
        console.error('대표 이미지 업로드 중 오류 발생:', error);
        alert('대표 이미지 업로드 중 오류가 발생했습니다.');
        return;
      }
    }

    try {
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const formData = new FormData();
          formData.append('file', image.file);

          const response = await fetch('http://localhost:8000/upload-image/', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('이미지 업로드 실패');
          }

          const data = await response.json();
          return { url: data.url, caption: image.desc };
        })
      );

      const postData: Post = {
        title: postTitle, // Use the state variable for title
        content: "", // 전체 내용은 비워두거나, 첫 번째 사진 설명 등으로 채울 수 있습니다.
        summary: summaryText, // Add summary
        thumbnail_image_url: uploadedThumbnailUrl, // Add thumbnail URL
        images: uploadedImages,
        author_username: username, // Pass the logged-in user's username
      };

      const response = await fetch('http://localhost:8000/share-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert('게시물이 성공적으로 공유되었습니다!');
        setImages([]);
        setThumbnailFile(null); 
        setThumbnailUrl(null); 
        setSummaryText(''); 
        router.push('/home');
      } else {
        alert('게시물 공유에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시물 공유 중 오류 발생:', error);
      alert('게시물 공유 중 오류가 발생했습니다.');
    }
  };


  return (
    <div>
      <HomeNavBar onRoomClick={toggleLoginView} />
      {!username ? (
        <LoginPageView onLoginSuccess={toggleLoginView} />
      ) : (
        <div className="container">
          <form className={styles.routineForm} onSubmit={(e) => { e.preventDefault(); handleShare(); }}>
            <div className={styles.topBar}>
              <button type="submit" className={styles.shareBtn}>공유하기</button>
            </div>
            <div className={styles.usernameSection}>
              <h3>작성자</h3>
              <input
                type="text"
                className={styles.usernameInput}
                value={username || ''}
                readOnly
              />
            </div>
            <div className={styles.titleSection}>
              <h3>게시물 제목</h3>
              <input
                type="text"
                className={styles.titleInput}
                placeholder="게시물 제목을 입력하세요"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>
            <div className={styles.thumbnailSection}>
              <h3>대표 사진 및 요약</h3>
              <div className={styles.thumbnailUploadBox} onClick={() => thumbnailFileInputRef.current?.click()}>
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="대표 사진 미리보기" className={styles.thumbnailPreview} />
                ) : (
                  <>
                    <span className={styles.addIcon}>+</span>
                    <span>대표 사진 추가</span>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={thumbnailFileInputRef}
                style={{ display: 'none' }}
                onChange={handleThumbnailFileChange}
              />
              <textarea
                className={styles.summaryTextarea}
                placeholder="게시물 요약을 입력하세요 (홈 화면에 표시됩니다)"
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
              />
            </div>

            <h3>추가 사진 및 설명</h3>
            {images.map((img, idx) => (
              <div className={styles.imgBlock} key={idx}>
                <div className={styles.imgRow}>
                  <img src={img.url} alt={`업로드 사진 ${idx + 1}`} className={styles.uploadImg} />
                  <textarea
                    className={styles.imgDesc}
                    placeholder="사진 설명"
                    value={img.desc}
                    onChange={e => handleDescChange(idx, e.target.value)}
                  />
                </div>
                <button type="button" className={styles.removeBtn} onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}>사진 삭제</button>
              </div>
            ))}
            <div className={styles.addBox} onClick={handleAddImage}>
              <span className={styles.addIcon}>+</span>
              <span>사진 추가</span>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </form>
        </div>
      )}
    </div>
  );
}
