import React, { useEffect, useRef, useState } from 'react';
import { usemainAlbumStore } from '../../../../store';
import gsap from 'gsap';

const MainAlbumItem = ({ al }) => {
    const { id, artist, album, artist_img, album_img, title } = al;
    const { MStart, MStop, musicModal } = usemainAlbumStore();
    const imgRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);

    const handleClick = () => {
        if (isPlaying) {
            MStop(id);
            setIsPlaying(false);
        } else {
            MStart(id, 'main');
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (isPlaying && imgRef.current) {
            gsap.killTweensOf(imgRef.current);
            gsap.to(imgRef.current, {
                rotation: 360,
                duration: 3,
                repeat: -1,
                ease: 'linear',
            });
        } else if (imgRef.current) {
            gsap.killTweensOf(imgRef.current);
            gsap.set(imgRef.current, { rotation: 0 });
        }
    }, [isPlaying]);

    // 음악 모달이 닫힐 때 회전 초기화
    useEffect(() => {
        if (musicModal?.id !== id) {
            setIsPlaying(false);
        }
    }, [musicModal]);

    return (
        <li onClick={handleClick} className={isPlaying ? 'active' : ''}>
            <div className="album_pic">
                <img ref={imgRef} src={album_img} alt={album} />
            </div>
            <div className="artist_pic">
                <div className="pic2">
                    <img src={artist_img} alt={artist} />
                </div>
            </div>
            <p>
                <strong>{title}</strong>
                <span>{artist}</span>
            </p>
        </li>
    );
};

export default React.memo(MainAlbumItem);
