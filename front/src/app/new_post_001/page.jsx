import React from 'react';

function Page() {

    const containerStyle = {
        maxWidth: '100%',
        width: '100%',
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

    // 왼쪽 미리보기 이미지 라인 스타일
    const previewImageStyle = {
        display: 'flex',
        flex: '0 0 30%',
        flexDirection: 'column',
        gap: '15px',
    };

    // 생성된 이미지 나오는곳 스타일
    const imageAreaStyle = {
        height: '90%',
        width: '100%',
        border: '1px solid black',
        backgroundColor : 'white',
    };

    // 오른쪽 작품 설명 ~ 버튼까지 스타일
    const TextContentAreaStyle = {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '10px',
        gap: '10px',
    };

    // 작품설명, 내용 텍스트 창 스타일
    const textInputStyle = {
        backgroundColor: 'white',
        minHeight: '200px',
        maxHeight: '200px',
        borderRadius: '8px',
    }

    // 버튼 정렬
    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
    };

    // 버튼 스타일
    const buttonStyle = {
        margin: '10px',
        border: '1px solid black',
        borderRadius: '4px',
        backgroundColor: 'white',
        color: 'black',
        paddingLeft: '5px',
        paddingRight: '5px',
    };

    // 입력창 위 설명창
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

    // =======================구==분==선===============================

    return (
        <div style={containerStyle}>

            {/*제목 입력칸*/}
            <div>
                <div style = {textStyle}>제목</div>
                <input
                    type = 'text'
                    placeholder= '제목을 입력해 주세요.'
                    style = {titleInputStyle}
                />
            </div>

            {/*이미지 ~ 버튼 칸*/}
            <div style = {mainContentStyle}>

                <div style = {previewImageStyle}>
                    <div style = {textStyle}>미리보기 이미지</div>
                    <div style = {imageAreaStyle}></div>
                </div>

                <div style = {TextContentAreaStyle}>
                    {/*작품 설명*/}
                    <div style = {textStyle}>작품 설명</div>
                    <textarea
                        placeholder = "작품 설명을 입력해 주세요."
                        style = {textInputStyle}
                    />

                    {/*작품 내용*/}
                    <div style = {textStyle}>작품 내용</div>
                    <textarea
                        placeholder = "작품 내용을 입력해 주세요."
                        style = {textInputStyle}
                    />

                    {/* 카테고리 */}
                    <div style = {textStyle}>카테고리</div>
                    <select style = {{backgroundColor: 'white'}}>
                        <option value="">카테고리 선택</option>
                        <option value="literature">문학</option>
                        <option value="humanities">인문</option>
                        <option value="art">예술</option>
                        <option value="study">어학</option>
                        <option value="recipe">실용서</option>
                    </select>

                    {/* 버튼 */}
                    <div style={buttonContainerStyle}>
                        <button style={buttonStyle}>
                            이미지 생성
                        </button>

                        <button style={buttonStyle}>
                            게시물 등록
                        </button>
                    </div>
                </div>





            </div>
        </div>
    );
}

export default Page;