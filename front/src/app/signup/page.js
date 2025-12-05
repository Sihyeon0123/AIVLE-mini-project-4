'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (pw !== pwCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('서버로 보낼 회원가입 데이터:', { id, pw, name });

    try {
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, pw, name }),
      });

      if (!res.ok) {
        throw new Error('서버 오류');
      }

      const result = await res.json();
      console.log('회원가입 서버 응답:', result);

      // ApiResponse 구조: { status, message, data }
      if (result.status === 'success') {
        alert('회원가입 성공! 이제 로그인 해주세요.');


        router.push('/login');
      } else {
        alert(result.message ?? '회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 요청 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="card-title">회원가입</h1>

        <form id="signupForm" className="form" onSubmit={handleSignup}>
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

          <label>
            PW 확인
            <input
              type="password"
              value={pwCheck}
              onChange={(e) => setPwCheck(e.target.value)}
            />
          </label>

          <label>
            이름
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          {/* 버튼은 기존 primary-btn 대신 공통 sub-btn 스타일 사용 */}
          <button type="submit" className="sub-btn" style={{ marginTop: "20px", width: "100%" }}>
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}
