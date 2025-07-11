import Link from 'next/link';
import styles from './HomeCardList.module.css';
import { useUserStore } from '../login/_entities/model/user-store';

interface PostImage {
  url: string;
  caption?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string; // Add summary
  thumbnail_image_url?: string; // Add thumbnail_image_url
  images: PostImage[];
  author_username: string; // Add author_username
  created_at: string; // Add created_at
  updated_at?: string; // Add updated_at for modified time
}

interface HomeCardListProps {
  posts: Post[];
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

export default function HomeCardList({ posts }: HomeCardListProps) {
  const { username: loggedInUsername } = useUserStore();

  if (!posts || !Array.isArray(posts)) {
    return <div className={styles.cardList}>No posts available.</div>;
  }

  return (
    <div className={styles.cardList}>
      {posts.map((post, idx) => (
        <Link href={`/post/${post.id}`} key={idx} className={styles.cardLink}>
          <div className={styles.card}>
            {post.thumbnail_image_url && (
              <div className={styles.cardImageContainer}>
                <img src={post.thumbnail_image_url} alt={post.title} className={styles.cardImg} />
              </div>
            )}
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{post.title}</div>
              <div className={styles.cardDesc}>{post.summary || post.content}</div> {/* Use summary if available */}
              <div className={styles.cardMeta}>
                <span className={styles.cardUser}>👤 {post.author_username}</span>
                <span className={styles.cardTime}>
                  {post.updated_at && new Date(post.updated_at) > new Date(post.created_at)
                    ? `${formatTimeAgo(post.updated_at)} (수정됨)`
                    : formatTimeAgo(post.created_at)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 