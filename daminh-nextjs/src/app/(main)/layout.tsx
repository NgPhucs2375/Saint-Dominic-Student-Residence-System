'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/layout/Sidebar";
import Header from "@/src/components/layout/Header";

type User = {
  fullName?: string;
  role?: string;
  [key: string]: unknown;
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;

    const savedUser = localStorage.getItem("daminh_user");
    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser) as User;
    } catch {
      return null;
    }
  });
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  if (!user) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#FDFCF8]">Đang xác thực...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Header />

        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%", minHeight: "100%" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}