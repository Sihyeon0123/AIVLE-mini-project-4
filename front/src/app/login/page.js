'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const router = useRouter();

  // 🔴 타입 부분 제거 (e: React.FormEvent → e)
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!id || !pw) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    console.log('서버로 보낼 데이터:', { id, pw });

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //credentials: 'include', // refreshToken 쿠키 받으려면 필요
        body: JSON.stringify({ id, pw }),
      });

      // 응답 바디보다 먼저 헤더에서 토큰 꺼내기
      const authHeader = res.headers.get('Authorization');

      // 🔴 타입 부분 제거 (string | null → 그냥 JS에서 null로 초기화)
      let accessToken = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7); // "Bearer " 떼고 순수 토큰만
      }

      const result = await res.json();
      console.log('HTTP status:', res.status);
      console.log('서버 응답 JSON:', result);

      if (res.ok && result.status === 'success') {
        alert('로그인 성공!');

        // accessToken 저장
        if (accessToken) {
          sessionStorage.setItem('accessToken', accessToken);
        }

        // userId 저장 (응답에 있으면 그걸 쓰고, 없으면 입력한 id 사용)
        if (result.userId) {
          sessionStorage.setItem('userId', result.userId);
        } else {
          sessionStorage.setItem('userId', id);
        }

        // if (result.name) {
        //   sessionStorage.setItem('userName', result.name);
        // }

        router.push('/'); // 메인 페이지로 이동
      } else {
        if (res.status === 404) {
          alert(result.message || '등록되지 않은 아이디입니다.');
        } else if (res.status === 401) {
          alert(result.message || '비밀번호가 일치하지 않습니다.');
        } else {
          alert(result.message || '로그인에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2 className="card-title">로그인</h2>

        <form className="form" onSubmit={handleLogin}>
          <label>
            아이디
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </label>

          <label>
            PW
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </label>

          <div className="btn-row--center">
            <button className="sub-btn" type="submit">
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
