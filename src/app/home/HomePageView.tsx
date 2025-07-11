'use client';

import { useState, useEffect } from 'react';
import HomeNavBar from './HomeNavBar';
import HomeCardList from './HomeCardList';
import LoginPageView from '../login/_features/ui/LoginPageView';
import { useUserStore } from '../login/_entities/model/user-store';

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
}

export default function HomePageView() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const { username } = useUserStore();

  const toggleLoginView = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8000/get-posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        console.log('가져온 게시물:', data);
      } else {
        console.error('게시물 가져오기 실패');
      }
    } catch (error) {
      console.error('게시물 가져오기 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <HomeNavBar onRoomClick={toggleLoginView} />
      <div className="container">
        <HomeCardList posts={posts} />
      </div>
      {isLoginVisible && <LoginPageView onLoginSuccess={toggleLoginView} />}
    </div>
  );
} 