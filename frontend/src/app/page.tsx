'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import useStorage from "@/hooks/useSessionStorage";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { getItem, removeItems } = useStorage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getItem('token', 'session');
    const userId = getItem('userId', 'session');
    setIsLoggedIn(!!token && !!userId);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    removeItems(['token', 'userId'], 'session');
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="h-[50vh] flex flex-col justify-center items-center px-4">
      <h1 className="text-6xl font-bold">WELCOME TO CHATS</h1>
      <br />
      {!isLoading && (
        !isLoggedIn && (
          <Button onClick={() => router.push("/login")}>Get Started</Button>
        )
      )}
    </div>
  );
}