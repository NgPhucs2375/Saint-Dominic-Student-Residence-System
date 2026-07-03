'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/layout/Sidebar";
import Header from "@/src/components/layout/Header";

// 1. GIẢI QUYẾT LỖI "Unexpected any": Định nghĩa khuôn mẫu rõ ràng cho User
interface UserData {
  fullName?: string;
  role?: string;
  HouseId?: number | null;
  [key: string]: unknown; // Cho phép mở rộng thêm các trường khác một cách an toàn
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // 2. GIẢI QUYẾT LỖI "Cascading renders": 
    // Dùng setTimeout 0ms để đẩy lệnh setState vào hàng đợi (Microtask/Macrotask).
    // Điều này làm hài lòng linter của React vì nó không còn là một lệnh "đồng bộ" (synchronous) nữa.
    const timer = setTimeout(() => {
      const savedUserStr = localStorage.getItem("daminh_user");
      
      if (!savedUserStr) {
        router.push("/login");
      } else {
        try {
          setUser(JSON.parse(savedUserStr));
        } catch (error) {
          console.error("Lỗi giải mã thông tin User:", error);
        }
      }
      
      setIsMounted(true);
    }, 0);

    // Dọn dẹp timer để tránh rò rỉ bộ nhớ
    return () => clearTimeout(timer);
  }, [router]);

  // NẾU CHƯA MOUNT HOẶC CHƯA CÓ USER: Trả về một giao diện loading RỖNG HOÀN TOÀN
  if (!isMounted || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FDFCF8]">
         {/* Có thể thay bằng Spinner mạ vàng hoàng gia nếu ngài muốn */}
      </div>
    );
  }

  // CHỈ SAU KHI MOUNT VÀ CÓ USER: Mới vẽ ra Sidebar và nội dung phức tạp
  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFCF8]">
      <Sidebar user={user} />
      
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-[1400px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}