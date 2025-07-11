'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './PostDetailView.module.css';
import HomeNavBar from '../home/HomeNavBar';
import { useUserStore } from '../login/_entities/model/user-store';

interface PostImage {
  url: string;
  caption?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string; // 홈 화면 카드에 사용되므로 상세 페이지에서는 표시하지 않음
  thumbnail_image_url?: string; // 홈 화면 카드에 사용되므로 상세 페이지에서는 표시하지 않음
  images: PostImage[]; // 추가 이미지 배열
  created_at: string;
  updated_at?: string; // 수정 시간을 위해 추가
  author_username: string; // Add author_username
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `방금 전`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}주 전`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;

  const years = Math.floor(days / 365);
  return `${years}년 전`;
};

export default function PostDetailView() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { username: loggedInUsername } = useUserStore();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`http://localhost:8000/posts/${id}`);
          if (response.ok) {
            const data = await response.json();
            setPost(data);
          } else {
            setError('게시물을 불러오는 데 실패했습니다.');
          }
        }
        catch (err) {
          setError('게시물 로딩 중 오류가 발생했습니다.');
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [id]);

  const handleDeletePost = async () => {
    if (!post) return;
    if (!confirm('정말로 이 게시물을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`http://localhost:8000/posts/${post.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('게시물이 성공적으로 삭제되었습니다.');
        router.push('/home'); // 삭제 후 홈으로 이동
      } else {
        alert('게시물 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생:', error);
      alert('게시물 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div className={styles.container}>로딩 중...</div>;
  if (error) return <div className={styles.container}>{error}</div>;
  if (!post) return <div className={styles.container}>게시물을 찾을 수 없습니다.</div>;

  return (
    <div>
      <HomeNavBar onRoomClick={() => {}} />
      <div className="container">
        <div className={`card ${styles.postCard}`}>
          <h1 className={styles.title}>{post.title}</h1>
          {loggedInUsername === post.author_username && (
            <div className={styles.postActions}>
              <button onClick={() => router.push(`/post/${id}/edit`)} className={styles.editBtn}>수정</button>
              <button onClick={handleDeletePost} className={styles.deleteBtn}>삭제</button>
            </div>
          )}
          <div className={styles.meta}>
            <span>작성자: {post.author_username}</span>
            <span>
              {post.updated_at && new Date(post.updated_at) > new Date(post.created_at)
                ? `${formatTimeAgo(post.updated_at)} (수정됨)`
                : formatTimeAgo(post.created_at)}
            </span>
          </div>
          <div className={styles.content}>
            {post.content.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          {post.images && post.images.length > 0 && (
            <div className={styles.additionalImages}>
              {post.images.map((image, imgIdx) => (
                <div key={imgIdx} className={styles.imageBlock}>
                  <img src={image.url} alt={image.caption || `이미지 ${imgIdx + 1}`} className={styles.image} />
                  {image.caption && <p className={styles.imageCaption}>{image.caption}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
