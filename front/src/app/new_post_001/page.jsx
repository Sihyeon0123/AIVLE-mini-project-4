"use client";

import React, { useState, useEffect } from 'react';

function Page() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategory] = useState("");
    const [imageUrl , setPreviewImageUrl] = useState("");

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/categories");
                const json = await res.json();

                if (Array.isArray(json.data)) {
                    setCategories(json.data);
                }
            } catch (err) {
                console.error("카테고리 불러오기 실패:", err);
            }
        };

        loadCategories();
    }, []);

    const handleSubmit = async () => {
        if (!title || !description || !content || !categoryId) {
            alert("제목, 설명, 내용, 카테고리를 모두 입력해 주세요.");
            return;
        }

        const postData = {
            title,
            description,
            content,
            categoryId,
        };

        localStorage.setItem("temp_post_data", JSON.stringify(postData));

        window.open("/new_post_002", "_blank");
    }

    const finalCheck = async () => {
        if (!title || !description || !content || !categoryId || !imageUrl) {
            alert("제목, 설명, 내용, 카테고리, 이미지 중 비어있는 곳이 존재합니다.");
            return;
        }

        const jwt = localStorage.getItem("accessToken");
        if (!jwt) {
            alert("로그인이 필요합니다.");
            return;
        }

        const finalPostData = {
            title,
            description,
            content,
            categoryId: Number(categoryId),
            imageUrl
        };

        try {
            const response = await fetch('http://localhost:8080/api/books/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify(finalPostData),
            });

            if (response.ok) {
                alert("게시물이 성공적으로 등록되었습니다!");
                window.location.href = "/";
                localStorage.removeItem("temp_post_data");
            } else {
                alert(`게시물 등록 실패: ${response.statusText}`);
            }
        } catch (error) {
            alert("서버 연결에 실패하여 게시물을 등록할 수 없습니다.");
        }
    };

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.imageUrl) {
                setPreviewImageUrl(event.data.imageUrl);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const containerStyle = {
        maxWidth: '100%',
        width: '80%',
        minHeight: 'auto',
        margin: '0 auto',
        border: '1px solid black',
        padding: '10px',
        backgroundColor : 'gray',
    };

    const titleInputStyle = {
        width: '100%',
        fontSize: '20px',
        marginTop: '10px',
        border: 'none',
        backgroundColor : 'white',
        color : 'black',
        borderRadius: '8px',
    }

    const mainContentStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop : '20px',
        gap : '10px',
    };

    const previewImageStyle = {
        display: 'flex',
        flex: '0 0 30%',
        flexDirection: 'column',
        gap: '15px',
    };

    const imageAreaStyle = {
        height: '90%',
        width: '100%',
        border: '1px solid black',
        backgroundColor : 'white',
    };

    const TextContentAreaStyle = {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '10px',
        gap: '10px',
    };

    const textInputStyle = {
        backgroundColor: 'white',
        minHeight: '200px',
        maxHeight: '200px',
        borderRadius: '8px',
    }

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
    };

    const buttonStyle = {
        margin: '10px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: 'white',
        color: 'black',
        paddingLeft: '5px',
        paddingRight: '5px',
    };

    const textStyle = {
        backgroundColor: 'black',
        display: 'inline-block',
        marginTop: '10px',
        borderRadius: '8px',
        paddingLeft: '5px',
        paddingRight: '5px',
        textAlign: 'center',
        color: 'white',
    }

    return (
        <div style={containerStyle}>

            <div>
                <div style={textStyle}>제목</div>
                <input
                    type='text'
                    placeholder='제목을 입력해 주세요.'
                    style={titleInputStyle}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div style={mainContentStyle}>

                <div style={previewImageStyle}>
                    <div style={imageAreaStyle}>
                        {imageUrl ? (
                            <img src={imageUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        ) : ("")}
                    </div>
                </div>

                <div style={TextContentAreaStyle}>

                    <div style={textStyle}>작품 설명</div>
                    <textarea
                        placeholder="작품 설명을 입력해 주세요."
                        style={textInputStyle}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div style={textStyle}>작품 내용</div>
                    <textarea
                        placeholder="작품 내용을 입력해 주세요."
                        style={textInputStyle}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div style={textStyle}>카테고리</div>
                    <select
                        style={{ backgroundColor: 'white' }}
                        value={categoryId}
                        onChange={(e) => setCategory(Number(e.target.value))}
                    >
                        <option value="">카테고리 선택</option>

                        {categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <div style={buttonContainerStyle}>
                        <button style={buttonStyle} onClick={handleSubmit}>
                            이미지 생성
                        </button>

                        <button style={buttonStyle} onClick={finalCheck}>
                            게시물 등록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
