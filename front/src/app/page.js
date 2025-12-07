"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "./api/apiClient"; 

export default function Home() {
  const [noJwtError, setNoJwtError] = useState("");
  const [jwtImageUrl, setJwtImageUrl] = useState("");

  useEffect(() => {
    const runFullAuthFlow = async () => {

      /* -----------------------------------------------------
       * 1) 로그인 요청
       * ----------------------------------------------------- */
      try {
        const loginRes = await axios.post(
          "http://localhost:8080/api/auth/login",
          { id: "test1", pw: "1234" },
          { withCredentials: true }
        );

        const authHeader = loginRes.headers["authorization"];
        const accessToken = authHeader.replace("Bearer ", "");
        localStorage.setItem("accessToken", accessToken);
      } catch (err) {
        console.error("로그인 실패:", err);
        return;
      }


      /* -----------------------------------------------------
       * 2) Refresh Token으로 Access Token 재발급 요청
       * ----------------------------------------------------- */
      try {
        const refreshRes = await axios.post(
          "http://localhost:8080/api/auth/token/refresh",
          {},
          { withCredentials: true }
        );

        const refreshAuth = refreshRes.headers["authorization"];
        const newAccessToken = refreshAuth.replace("Bearer ", "");
        localStorage.setItem("accessToken", newAccessToken);
      } catch (err) {
        console.error("재발급 요청 실패:", err);
      }


      /* -----------------------------------------------------
       * 3) 이미지 요청 테스트 (이미지 = byte[])
       * ----------------------------------------------------- */

      /* --- 3-1. JWT 없이 요청 → 에러 div 출력 --- */
      try {
        await axios.get("http://localhost:8080/api/books/cover/0", {
          responseType: "blob",
        });
      } catch (err) {
        console.error("JWT 없이 요청 실패:", err);
        setNoJwtError(err.response?.data?.message || "권한 부족 (401/403)");
      }

      /* --- 3-2. JWT 포함 요청(apiClient) → 이미지 표시 --- */
      try {
        const withJwtRes = await api.get("/books/cover/0", {
          responseType: "blob", // ★ byte[] 수신
        });

        const blob = withJwtRes.data;
        const url = URL.createObjectURL(blob); // ★ Blob → 브라우저 URL
        setJwtImageUrl(url);

      } catch (err) {
        console.error("JWT 포함 요청 실패:", err);
      }
    };

    runFullAuthFlow();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      
      <h2>JWT 없이 요청한 결과</h2>
      {noJwtError ? (
        <div style={{ color: "red", fontWeight: "bold" }}>에러: {noJwtError}</div>
      ) : (
        <div>요청 중...</div>
      )}

      <hr />

      <h2>JWT 포함(apiClient) 요청 결과</h2>
      {jwtImageUrl ? (
        <img
          src={jwtImageUrl}
          alt="Book Cover"
          style={{
            width: "300px",
            border: "1px solid #333",
            borderRadius: "6px",
            marginTop: "10px",
          }}
        />
      ) : (
        <div>이미지 요청 중…</div>
      )}
    </div>
  );
}
