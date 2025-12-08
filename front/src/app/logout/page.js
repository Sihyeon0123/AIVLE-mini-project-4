'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    const doLogout = async () => {
      try {
        // 백엔드 로그아웃 API 호출
        if (accessToken) {
          await fetch('http://localhost:8080/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include',
          });
        }
      } catch (err) {
        console.error('로그아웃 요청 중 오류:', err);
      } finally {
        // 1) localStorage 먼저 지우기 (Navbar가 보는 곳)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');

        // 추가로 sessionStorage도 지워도 OK
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');

        // 2) 전체 새로고침(중요!!)
        window.location.href = '/';
      }
    };

    doLogout();
  }, [router]);

  return (
    <div className="page">
      <div className="card">
        <h2 className="card-title">로그아웃 중...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
