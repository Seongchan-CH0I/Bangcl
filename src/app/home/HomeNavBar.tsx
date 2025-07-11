"use client"
import { useState } from 'react';
import styles from './HomeNavBar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '../login/_entities/model/user-store';

export default function HomeNavBar({ onRoomClick }: { onRoomClick: () => void }) {
  const pathname = usePathname();
  const { username, setUsername } = useUserStore();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setUsername(null);
    setShowLogout(false);
  };

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
      <div className={styles.authContainer}>
        {username ? (
          <>
            {showLogout && (
              <button className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
            )}
            <div className={styles.userContainer} onClick={() => setShowLogout(!showLogout)}>
              <div className={styles.username}>{username}</div>
            </div>
          </>
        ) : (
          <button className={styles.loginButton} onClick={onRoomClick}>로그인</button>
        )}
      </div>
    </nav>
  );
} 