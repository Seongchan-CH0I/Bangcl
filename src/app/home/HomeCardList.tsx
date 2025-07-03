import styles from './HomeCardList.module.css';

interface Post {
  title: string;
  content: string;
  imageUrl?: string;
}

interface HomeCardListProps {
  posts: Post[];
}

export default function HomeCardList({ posts }: HomeCardListProps) {
  return (
    <div className={styles.cardList}>
      {posts.map((post, idx) => (
        <div className={styles.card} key={idx}>
          {post.imageUrl && <img src={post.imageUrl} alt={post.title} className={styles.cardImg} />}
          <div className={styles.cardBody}>
            <div className={styles.cardTitle}>{post.title}</div>
            <div className={styles.cardDesc}>{post.content}</div>
            <div className={styles.cardMeta}>
              <span className={styles.cardUser}>👤 Unknown</span>
              <span className={styles.cardTime}>Just now</span>
            </div>
            <div className={styles.cardStats}>
              <span className={styles.cardLike}>❤️ 0</span>
              <span className={styles.cardComment}>💬 0</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 