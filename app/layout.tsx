import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Team Tasks Board',
  description: 'A simple task management application',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}