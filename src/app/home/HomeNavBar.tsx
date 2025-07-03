"use client"
import styles from './HomeNavBar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomeNavBar({ onRoomClick }: { onRoomClick: () => void }) {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>방클<span className={styles.logoSub}>BangClean</span></div>
      <div className={styles.menu}>
        <Link href="/home" passHref>
         <span className={`${styles.menuItem} ${pathname === '/home' ? styles.active : ''}`}>홈</span>
        </Link>
        <Link href="/routine" passHref>
          <span className={`${styles.menuItem} ${pathname === '/routine' ? styles.active : ''}`}>루틴 공유</span>
        </Link>
      </div>
      <button className={styles.loginButton} onClick={onRoomClick}>로그인</button>
    </nav>
  );
} 