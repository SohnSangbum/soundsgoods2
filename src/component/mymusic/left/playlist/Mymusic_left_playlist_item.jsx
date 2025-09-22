import React, { useRef, useState } from 'react';

const Mymusic_left_playlist_item = ({ playlist, onClick, onDelete }) => {
    const [profileImg, setProfileImg] = useState('/images/mymusic/playlist.png');
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImg(imageUrl);
        }
    };

    return (
        <div className="playlistItem">
            <div className="playlistimg">
                <img src={profileImg} alt="" onClick={onClick} />
                <h2>{playlist.name}</h2>
                <button className="delete_btn" onClick={() => fileInputRef.current.click()}>
                    표지변경
                </button>
                <button className="delete_btn" onClick={onDelete}>
                    삭제
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>
        </div>
    );
};

export default Mymusic_left_playlist_item;
