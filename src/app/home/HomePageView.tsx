'use client';

import { useState, useEffect } from 'react';
import HomeNavBar from './HomeNavBar';
import HomeCardList from './HomeCardList';
import LoginPageView from '../login/_features/ui/LoginPageView';

interface Post {
  title: string;
  content: string;
  imageUrl?: string;
}

export default function HomePageView() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const toggleLoginView = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/get-posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
          console.log('가져온 게시물:', data.posts);
        } else {
          console.error('게시물 가져오기 실패');
        }
      } catch (error) {
        console.error('게시물 가져오기 중 오류 발생:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ background: '#f6f8fa', minHeight: '100vh' }}>
      <HomeNavBar onRoomClick={toggleLoginView} />
      <HomeCardList posts={posts} />
      {isLoginVisible && <LoginPageView onLoginSuccess={toggleLoginView} />}
    </div>
  );
} 