import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/widgets/Navbar/Navbar';
import { Toaster } from 'sonner';

// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// Шрифты
// const Roboto = localFont({
//   src: [
//     {
//       path: '../../public/fonts/Robotocondensed.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//   ],
//   display: 'swap',
//   variable: '--base-font',
// });
// ? clsx(Roboto.variable) для body

export const metadata: Metadata = {
  title: 'Next.js Project',
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, et',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: any;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <head></head>
      <body>
        <div className="flex">
          <Navbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
