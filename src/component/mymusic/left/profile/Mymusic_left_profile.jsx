import React, { useRef, useState } from 'react';
import useUserStore from '../../../../store/userSlice';

const Mymusic_left_profile = () => {
    const { userInfo } = useUserStore();
    // 사진교체함수
    const [profileImg, setProfileImg] = useState('/images/mymusic/ProfilePic.png');
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImg(imageUrl);
        }
    };
    const handleClick = () => {
        fileInputRef.current.click();
    };
    // 여기까지 사진교체함수

    return (
        <div className="Mymusic_left_profile">
            <div className="left_profile">
                <div className="profileimg" onClick={handleClick} style={{ cursor: 'pointer' }}>
                    <img src={profileImg} alt="프로필" />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>
                <div className="profile">
                    <div className="profile_top">
                        <h2>yjj 님</h2>
                        <p>이용권이 21일 남았습니다</p>
                    </div>
                    <div className="profile_friend">
                        <div className="profile_follow">
                            <h2></h2>
                            <p></p>
                        </div>
                        <div className="profile_following">
                            <h2>팔로우하는 아티스트</h2>
                            <p>253</p>
                        </div>
                    </div>
                    <div className="profile_bottom">
                        <h2>상태메세지</h2>
                        <p>이런 노래 좋아하는 사람 어디있어요 ?</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mymusic_left_profile;
