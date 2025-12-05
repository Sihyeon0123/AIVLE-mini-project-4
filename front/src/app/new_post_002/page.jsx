import React from "react";

function Page() {

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

    return (
        <div style={containerStyle}>

            {/*표지 넣을 곳*/}
            <div style = {previewImageStyle}>표지 들어갈 곳</div>

            {/*버튼*/}
            <div style={buttonContainerStyle}>
                <button style={buttonStyle}>
                    재생성
                </button>

                <button style={buttonStyle}>
                    결정
                </button>
            </div>
        </div>
    )

}
export default Page;