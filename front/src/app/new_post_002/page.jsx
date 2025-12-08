"use client";

import React, { useState, useEffect } from "react";

function Page() {
    const [imageUrl, setImageUrl] = useState("");

    const [postData, setPostData] = useState({
        title: "",
        description: "",
        content: "",
        category: "",
    });

    // ========================== JWT로 개인 API Key 가져오기 ==========================
    const getUserApiKey = async () => {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
            alert("로그인이 필요합니다.");
            return null;
        }

        try {
            const res = await fetch("http://localhost:8080/api/auth/signup", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                },
            });

            if (!res.ok) throw new Error("API Key 조회 실패");

            const data = await res.json();
            return data.apiKey;

        } catch (err) {
            console.error(err);
            alert("API Key를 가져오지 못했습니다.");
            return null;
        }
    };

    // ========================== DALL·E 이미지 생성 ==========================
    const imageGenerate = async (data = postData) => {
        if (!data || !data.title) {
            alert("유효한 게시물 데이터가 없습니다.");
            return;
        }

        const apiKey = await getUserApiKey();
        if (!apiKey) return;


        const prompt = `제목: ${data.title}, 설명: ${data.description}, 내용을 기반으로 예술적인 책 표지 이미지를 생성`;

        try {
            const res = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt,
                    size: "1024x1024",
                    quality: "hd",
                }),
            });

            const result = await res.json();
            const url = result.data?.[0]?.url;

            if (!url) {
                // 오류 출력
                console.error("OpenAI Error:", result.error);
                alert(`이미지 URL을 받지 못했습니다. OpenAI 오류: ${result.error?.message || '알 수 없는 오류'}`);
                return;
            }

            setImageUrl(url);

        } catch (err) {
            console.error("네트워크 또는 DALL·E API 오류:", err);
            alert("이미지 생성 중 오류 발생");
        }
        }

    // ========================== 이미지 자동 생성 ==========================
    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch("http://localhost:8080/api/books/cover/generate", {
                method: "GET",
            });

            const data = await res.json();
            setPostData(data);

            // 첫 이미지 자동 생성
            imageGenerate(data);
        };

        fetchPost();
    }, []);

    // ==================== 결정 버튼 ===============

    const handleDecision = () => {
        if (imageUrl && window.opener) {
            window.opener.postMessage({imageUrl: imageUrl}, "*");

            window.close(); // 메시지 전송 후 창을 닫습니다.
        }
    }

    const containerStyle = {
        maxWidth: '75%',
        width: '100%',
        minHeight: 'auto',
        margin: '0 auto',
        border: '1px solid black',
        padding: '10px',
        backgroundColor : 'gray'
    };

    // 미리보기 이미지 나오는 곳
    const previewImageStyle = {
        border : '1px solid black',
    };

    // 버튼 나누기
    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
    };

    // 버튼 모양
    const buttonStyle = {
        margin: '10px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: 'white',
        color: 'black',
        paddingLeft: '10px',
        paddingRight: '10px',
    };

    // ========================== UI ==========================
    return (
            <div style={containerStyle}>
                <div style={previewImageStyle}>
                    {imageUrl && <img src={imageUrl} style={{ width: "100%" }} />}
                </div>

                <div style={buttonContainerStyle}>
                    <button style={buttonStyle} onClick={imageGenerate}>
                        재생성
                    </button>
                    <button style={buttonStyle} onClick={handleDecision}>
                        결정
                    </button>
                </div>
            </div>
    );

}

export default Page;
