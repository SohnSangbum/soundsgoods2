import { useState } from 'react';
import { usemainAlbumStore } from '../../../store';
import { AiOutlineClose } from 'react-icons/ai';
const Mymusic_right_Item = ({ song, type = 'top', onDelete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const { MStart, MStop } = usemainAlbumStore();

    const {
        togglePlayPause, // MStart 대신 togglePlayPause 사용

        currentPlayerId,
    } = usemainAlbumStore();

    // 이 아이템이 현재 재생 중인지 확인
    const isCurrentPlaying = isPlaying && currentPlayerId === song.id;
    const handleDelete = (e) => {
        e.stopPropagation(); // 재생 이벤트 막기
        onDelete(song.id); // 부모에게 삭제 요청
    };
    const handleClick1 = () => {
        togglePlayPause(song.id, type); // 토글 함수 사용
    };
    const handleClick = () => {
        if (isPlaying) {
            MStop(song.id); // 재생 중이면 정지
            setIsPlaying(false);
        } else {
            MStart(song.id, type); // 정지 상태면 재생
            setIsPlaying(true);
        }
    };

    return (
        <div className="Mymusic_right_Item" onClick={handleClick}>
            <div className="right_img">
                <img src={song.image} alt={song.title} />
                <button className="play-btn">
                    <img
                        src={
                            isCurrentPlaying
                                ? '/images/streaming/mv-pause-icon.png'
                                : '/images/streaming/mv-play-icon.png'
                        }
                        alt={isCurrentPlaying ? 'Pause' : 'Play'}
                        style={{ cursor: 'pointer' }}
                        onClick={handleClick1}
                    />
                </button>
            </div>
            <div className="right_text">
                <div className="title">
                    <h2>{song.title}</h2>
                    <div className="xbutton">
                        <AiOutlineClose onClick={handleDelete} />
                    </div>
                </div>
                <div className="subtitle">
                    <p>{song.artist}</p>
                </div>
            </div>
        </div>
    );
};

export default Mymusic_right_Item;
