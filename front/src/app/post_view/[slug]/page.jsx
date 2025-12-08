'use client'

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

//import api from "../api/apiClient";

// (컴포넌트) 책 정보
function BookDetailsView({ authorName, updatedAt, coverImgUrl, content }) {
    return (
        <div className="row justify-content-center">
            {/* 왼쪽: 이미지 */}
            <div className="col-12 col-md-3 text-center">
                <br/>
                {coverImgUrl && (
                    <img
                        src={coverImgUrl}
                        width={300}
                        className="img-fluid"
                        alt="cover"
                    />
                )}
            </div>
            {/* 오른쪽: 정보 */}
            <div className="col-12 col-md-9">
                <br/>
                <div><b>작성자: </b>{authorName}</div>
                <br/>
                <div><b>수정일: </b> {updatedAt}</div>
                <br/>
                <div><b>(본문)</b></div>
                <div
                    className="mt-2"
                    style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "break-word"
                    }}
                >{content}</div>
            </div>
        </div>
    );
}

// (컴포넌트) 수정/삭제 버튼
function BookEditMenu() {
    return (
        <div className="row justify-content-center mt-4">
            <div className="col-auto">
                <button className="btn btn-primary me-2"
                    onClick={()=>{
                        // TODO: 수정 버튼 눌렀을 시의 처리
                    }}
                >수정</button>
                <button className="btn btn-danger"
                    onClick={()=>{
                        // TODO: 삭제 버튼 눌렀을 시의 처리
                    }}>삭제</button>
            </div>
        </div>
    );
}

// // Mock Response (Success)
// function createMockResponseSuccessful(bookId) {
//     let dummyText = "TEST_BOOK_CONTENT"
//     for (let i=0; i < 5; i++) {
//         dummyText += dummyText;
//     }
//     return {
//         status: "success",
//         message: "도서상세조회성공",
//         data: {
//             bookID: bookId,
//             title: "TEST_BOOK_TITLE",
//             description: "",
//             content:dummyText,
//             categoryId: "",
//             imageUrl:"",
//             ownerUserId:"testuser",
//             createdAt:(new Date()).toString(),
//             updatedAt:(new Date()).toString()
//         }
//     }
// }

// // Mock Response (Not Found)
// function createMockResponseNotFound(bookId) {
//     return {
//         status: "error",
//         message: "도서를 찾을 수 없습니다"
//     }
// }

// (화면 본체)
export default function PostView(props){
    const router = useRouter();

    // State: 도서 세부 데이터
    const [bookData, setBookData]=useState({
        owner_id:'',
        owner_nickname:'',
        updated_at:'',
        cover_img_url:'',
        content:''
    });

    // State: 로그인 여부 판정
    //const loggedOn = api.get

    // (도서 정보 조회 처리)
    const getDetails = async(idx)=>{
        //// MEMO: 일단은 하드코딩해놓은 거 사용
        //let response = ((Math.random() < 1.0) ?
        //    createMockResponseSuccessful(idx) : createMockResponseNotFound(idx)
        //);
        //
        try {
            const response = await fetch(
                `http://localhost:8080/api/books/detail/${idx}`
            );
            const response_body = await response.json();
            //console.log(response_body.status);
            //console.log(response_body.message);
            //console.log(response_body.data);
            //
            // 문제가 없을 경우에는 도서 정보 입력
            if (response_body.status === 'success') {
                // TODO: 작성자 닉네임만 가져온다 (userNickname 확인해주는 API 필요)
                let owner_nickname = "";
                // 도서 정보 반영
                setBookData({
                    owner_id:response_body.data.ownerUser,
                    owner_nickname:owner_nickname,
                    updated_at:response_body.data.updatedAt,
                    cover_img_url:response_body?.data?.imageUrl ?? "",
                    content:response_body.data.content
                });
            }
        } catch {
            // 가져오는 과정에서 에러가 났거나 도서가 존재하지 않는 경우에는 뒤로 돌린다
            alert("도서 정보를 가져올 수 없습니다.");
            router.back();
        }
    }

    // slug로 들어온 도서ID로 도서 정보 조회
    useEffect(() => {
        props.params.then(({slug})=>{
            //console.log("idx :"+slug);
            getDetails(slug);
        });
    },[props.params]);

    // TODO: 작성자 본인 여부 판정
    // - Access Token이 있는지부터 확인
    // - Access Token이 있으면 현재 사용자 ID가 author_id와 일치하는지 확인
    const isOwner = true;

    // 사용자가 작성자 본인일 경우에는 편집 메뉴 추가
    return (
        <div className="container d-flex justify-content-center">
            <div className="w-100">
                <BookDetailsView
                    coverImgUrl={
                        bookData.cover_img_url.length < 1
                            ? null
                            : bookData.cover_img_url
                    }
                    updatedAt={bookData.updated_at}
                    authorName={bookData.owner_id}
                    content={bookData.content}
                />
                {isOwner && <BookEditMenu />}
            </div>
        </div>
    );
}