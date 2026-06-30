import type { Metadata } from "next";
import { Cinzel } from 'next/font/google'; // Import công cụ font của Next.js
import "./globals.css";

// 1. Cấu hình Font chữ Cinzel
const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel', // Dùng biến CSS để linh hoạt trong Tailwind
});

export const metadata: Metadata = {
  title: "Đa Minh Ledger - Quản trị Lưu xá",
  description: "Hệ thống quản trị tài chính và nhân sự lưu xá tối giản",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Áp dụng class font vào thẻ html
    <html lang="vi" className={cinzel.className}>
      <body className="bg-[#FDFCF8] text-[#2D2B2A]">
        {children}
      </body>
    </html>
  );
}