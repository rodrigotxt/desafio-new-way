// src/pages/index.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../lib/auth';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/tasks');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <p>Redirecionando...</p>
    </div>
  );
};

export default HomePage;