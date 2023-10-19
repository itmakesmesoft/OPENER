import './globals.css';
import './styles/index.scss';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import AuthContext from '@/context/AuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OPENER',
  description: 'AI 영어 학습 플랫폼',
  icons: {
    icon: '/favicon.ico',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>OPENER</title>
      </head>
      <body>
        <AuthContext>
          <TopNav />
          <div className="content h-full p-0 pb-[68px] lg:pb-0">{children}</div>
          <BottomNav />
        </AuthContext>
      </body>
    </html>
  );
};

export default RootLayout;
