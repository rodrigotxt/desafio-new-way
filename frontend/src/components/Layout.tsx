// src/components/Layout.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { removeToken, isAuthenticated } from '../lib/auth';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Next.js App' }) => {
  const router = useRouter();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <nav>
          <Link href="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Início</Link>
          {loggedIn && (
            <Link href="/tasks" style={{ marginRight: '15px', textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Tarefas</Link>
          )}
        </nav>
        {loggedIn ? (
          <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Sair</button>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold', padding: '8px 15px', border: '1px solid #28a745', borderRadius: '5px' }}>Login</Link>
        )}
      </header>
      {children}
      <footer style={{ marginTop: '30px', paddingTop: '10px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '0.8em', color: '#666' }}>
        <p>&copy; {new Date().getFullYear()} Next.js App</p>
      </footer>
    </div>
  );
};

export default Layout;