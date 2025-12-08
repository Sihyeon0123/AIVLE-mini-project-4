'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/apiClient';

export default function MyInfoPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [apiKey, setApiKey] = useState('');   // ⭐ API Key 상태 추가
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  const router = useRouter();

  // ===============================
  // ⭐ 1) 유저 정보 로딩
  // ===============================
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const res = await api.get('/auth/user-info');

        const { id, name } = res.data;

        const headerApiKey = res.headers['api-key'];

        console.log('API Key from Header:', headerApiKey);

        setUserId(id);
        setUserName(name);
        setOriginalName(name);

        if (headerApiKey) setApiKey(headerApiKey); // ⭐ input 칸에 자동 채우기

      } catch (err) {
        console.error('유저 정보 조회 실패:', err);

        if (err.response?.status === 401) {
          alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
          router.push('/login');
        } else {
          alert('사용자 정보를 불러오지 못했습니다.');
        }
      }
    };

    loadUserInfo();
  }, [router]);

  // ===============================
  // 기존 수정 함수 등은 그대로
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = userName.trim();
    const trimmedPw = pw.trim();
    const trimmedPwCheck = pwCheck.trim();

    if (!trimmedName && !trimmedPw && !trimmedPwCheck) {
      alert('변경할 내용을 입력해주세요.');
      return;
    }

    if (trimmedPw || trimmedPwCheck) {
      if (!trimmedPw || !trimmedPwCheck) {
        alert('비밀번호와 비밀번호 확인을 모두 입력해주세요.');
        return;
      }
      if (trimmedPw !== trimmedPwCheck) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    const body = {};
    if (trimmedName) body.name = trimmedName;
    if (trimmedPw) body.pw = trimmedPw;

    try {
      const res = await api.patch('/auth/update', body);

      if (res.data.status === 'success') {
        alert('회원정보가 성공적으로 수정되었습니다.');
        if (body.name) {
          setOriginalName(body.name);
          sessionStorage.setItem('userName', body.name);
        }
        setPw('');
        setPwCheck('');
      } else {
        alert(res.data.message ?? '회원정보 수정 실패');
      }
    } catch (error) {
      console.error(error);
      alert('서버 통신 오류');
    }
  };

  const handleDelete = async () => {
    const trimmedPw = pw.trim();
    if (!trimmedPw) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    const ok = window.confirm('정말 탈퇴하시겠습니까?');
    if (!ok) return;

    try {
      const res = await api.post('/auth/delete', { pw: trimmedPw });

      if (res.data.status === 'success') {
        alert('회원 탈퇴 완료');
        sessionStorage.clear();
        router.push('/signup');
      } else {
        alert(res.data.message ?? '회원 탈퇴 실패');
      }
    } catch (error) {
      console.error(error);
      alert('서버 통신 오류');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2 className="card-title">회원정보 수정</h2>

        <form className="form" onSubmit={handleSubmit}>
          
          {/* ID 표시 */}
          <label>
            아이디
            <input
              type="text"
              value={userId || '-'}
              readOnly
              style={{
                marginTop: '6px',
                fontWeight: '600',
                backgroundColor: '#f3f3f3',
                cursor: 'not-allowed'
              }}
            />
          </label>

          {/* 이름 */}
          <label>
            이름
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {originalName && (
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#999' }}>
                현재 등록된 이름: {originalName}
              </div>
            )}
          </label>

          {/* ⭐ API Key */}
          <label>
            API Key
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </label>

          {/* 비밀번호 변경 */}
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

          <div className="btn-row--right">
            <button className="sub-btn" type="submit">수정하기</button>
            <button className="sub-btn" type="button" onClick={handleDelete}>
              회원 탈퇴
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
