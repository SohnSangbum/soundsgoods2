// Con2Top100Item.jsx
import { usemainAlbumStore } from '../../../store';

const Con2Top100Item = ({ data, type }) => {
    const {
        togglePlayPause, // MStart 대신 togglePlayPause 사용
        isPlaying,
        currentPlayerId,
    } = usemainAlbumStore();

    // 이 아이템이 현재 재생 중인지 확인
    const isCurrentPlaying = isPlaying && currentPlayerId === data.id;

    const handleClick = () => {
        togglePlayPause(data.id, type); // 토글 함수 사용
    };

    return (
        <li className="rank">
            <div className="img-wrap">
                <strong>{data.id}</strong>
                <img src={data.image} alt="" />
                <button className="play-btn" onClick={handleClick}>
                    <img
                        className="img"
                        src={
                            isCurrentPlaying
                                ? '/images/streaming/mv-pause-icon.png'
                                : '/images/streaming/mv-play-icon.png'
                        }
                        alt={isCurrentPlaying ? 'Pause' : 'Play'}
                        style={{ cursor: 'pointer' }}
                    />
                </button>
            </div>
            <h4>{data.title}</h4>
            <strong>{data.artist}</strong>
            <p>{data.release}</p>
        </li>
    );
};

export default Con2Top100Item;
