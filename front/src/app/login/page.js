'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log('서버로 보낼 데이터:', { id, pw });

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, pw }),
      });

      // 헤더에서 토큰 먼저 꺼내기
      const authHeader = res.headers.get('Authorization');
      let token = null;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // "Bearer " 떼고 순수 토큰만 추출
      }

      const result = await res.json();
      console.log('서버 응답:', result);

      //if (res.ok && result.status === 'success')
      if (res.ok) {
        alert('로그인 성공!');

        if (token) {
          sessionStorage.setItem('token', token);
        }

        // 아이디 저장 (백엔드 LoginResponse.userId)
        if (result.userId) {
          sessionStorage.setItem('userId', result.userId);
        } else {
          sessionStorage.setItem('userId', id);
        }

        // 이름은 백엔드에서 안 내려줌 → 지금은 비워둘 수밖에 없음
        // 나중에 백엔드가 name 내려주면 아래처럼 사용
        // if (result.name) {
        //   sessionStorage.setItem('userName', result.name);
        // }

        router.push('/');

      } else {
        // 오류 케이스
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
