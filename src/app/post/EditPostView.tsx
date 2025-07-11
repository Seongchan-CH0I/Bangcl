'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HomeNavBar from '../home/HomeNavBar';
import styles from './EditPostView.module.css';
import { useUserStore } from '../login/_entities/model/user-store';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Assuming react-query is used

interface PostImage {
  url: string;
  caption?: string;
  file?: File; // For new uploads
}

interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string;
  thumbnail_image_url?: string;
  images: PostImage[];
  author_username: string;
  created_at: string;
}

// Assuming a new mutation hook will be created for updating posts
// import { useUpdatePost } from './_entities/api/queries'; // This will be created later

export default function EditPostView() {
  const params = useParams();
  const router = useRouter();
  const { id } = params; // post_id
  const { username: loggedInUsername } = useUserStore();
  const queryClient = useQueryClient(); // For invalidating queries

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [postTitle, setPostTitle] = useState<string>('');
  const [summaryText, setSummaryText] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<PostImage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`http://localhost:8000/posts/${id}`);
          if (response.ok) {
            const data: Post = await response.json();
            if (loggedInUsername !== data.author_username) {
              alert('이 게시물을 수정할 권한이 없습니다.');
              router.push(`/post/${id}`); // Redirect if not author
              return;
            }
            setPost(data);
            setPostTitle(data.title);
            setSummaryText(data.summary || '');
            setThumbnailUrl(data.thumbnail_image_url || null);
            setAdditionalImages(data.images || []);
          } else {
            setError('게시물을 불러오는 데 실패했습니다.');
          }
        } catch (err) {
          setError('게시물 로딩 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, loggedInUsername, router]);

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setThumbnailFile(file);
      setThumbnailUrl(url);
    }
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setAdditionalImages((prev) => [...prev, { file, url, caption: '' }]);
    }
  };

  const handleDescChange = (idx: number, value: string) => {
    setAdditionalImages((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, caption: value } : img))
    );
  };

  const handleRemoveImage = (idx: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const updatePostMutation = useMutation({
    mutationFn: async (updatedPostData: any) => { // Type will be more specific later
      const response = await fetch(`http://localhost:8000/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPostData),
      });
      if (!response.ok) {
        throw new Error('게시물 업데이트 실패');
      }
      return response.json();
    },
    onSuccess: () => {
      alert('게시물이 성공적으로 업데이트되었습니다.');
      queryClient.invalidateQueries(['post', id]); // Invalidate cache for this post
      router.push(`/post/${id}`); // Go back to detail view
    },
    onError: (err) => {
      alert(`게시물 업데이트 중 오류 발생: ${err.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    let uploadedThumbnailUrl = thumbnailUrl;
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

    const updatedImages = await Promise.all(
      additionalImages.map(async (img) => {
        if (img.file) { // If it's a new file to upload
          const formData = new FormData();
          formData.append('file', img.file);
          const response = await fetch('http://localhost:8000/upload-image/', {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) {
            throw new Error('추가 이미지 업로드 실패');
          }
          const data = await response.json();
          return { url: data.url, caption: img.caption };
        }
        return { url: img.url, caption: img.caption }; // Existing image
      })
    );

    const updatedPostData = {
      title: postTitle,
      content: post.content, // Assuming content is not editable via this form, or needs a separate field
      summary: summaryText,
      thumbnail_image_url: uploadedThumbnailUrl,
      images: updatedImages,
      author_username: loggedInUsername, // Ensure author_username is sent
    };

    updatePostMutation.mutate(updatedPostData);
  };

  if (loading) return <div className="container">로딩 중...</div>;
  if (error) return <div className="container">{error}</div>;
  if (!post) return <div className="container">게시물을 찾을 수 없습니다.</div>;

  return (
    <div>
      <HomeNavBar onRoomClick={() => {}} />
      <div className="container">
        <form className={styles.editForm} onSubmit={handleSubmit}>
          <div className={styles.topBar}>
            <button type="submit" className={styles.saveBtn}>저장하기</button>
          </div>
          <div className={styles.uploadArea}>
            <div className={styles.usernameSection}>
              <h3>작성자</h3>
              <input
                type="text"
                className={styles.usernameInput}
                value={post.author_username || ''}
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
            {/* Representative Photo and Summary Section */}
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

            {/* Existing Image Upload Section */}
            <h3>추가 사진 및 설명</h3>
            {additionalImages.map((img, idx) => (
              <div className={styles.imgBlock} key={idx}>
                <div className={styles.imgRow}>
                  <img src={img.url} alt={`업로드 사진 ${idx + 1}`} className={styles.uploadImg} />
                  <textarea
                    className={styles.imgDesc}
                    placeholder="사진 설명"
                    value={img.caption || ''}
                    onChange={e => handleDescChange(idx, e.target.value)}
                  />
                </div>
                <button type="button" className={styles.removeBtn} onClick={() => handleRemoveImage(idx)}>사진 삭제</button>
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
          </div>
        </form>
      </div>
    </div>
  );
}
