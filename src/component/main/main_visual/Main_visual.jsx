import React, { useState, useEffect, useRef } from 'react';
import './style.scss';

const Main_visual = () => {
    const teamMembers = [{ name: 'G-DRAGON' }, { name: 'IU' }, { name: 'DEMON HUNTERS' }];

    const teamVideos = [
        'https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_too.mov',
        'https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_tooo.MOV',
        'https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_to.mp4',
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const videoRefs = useRef([]);

    const updateCarousel = (newIndex) => {
        if (isAnimating) return;
        setIsAnimating(true);

        const index = (newIndex + teamMembers.length) % teamMembers.length;
        setCurrentIndex(index);

        setTimeout(() => {
            setIsAnimating(false);
        }, 800);
    };

    const handlePrevious = () => {
        updateCarousel(currentIndex - 1);
    };

    const handleNext = () => {
        updateCarousel(currentIndex + 1);
    };

    const handleDotClick = (index) => {
        updateCarousel(index);
    };

    const handleCardClick = (index) => {
        updateCarousel(index);
    };

    // 모든 비디오 정지
    const pauseAllVideos = () => {
        videoRefs.current.forEach((video) => {
            if (video) {
                video.pause();
                video.currentTime = 0; // 처음으로 되돌리기
            }
        });
    };

    // 컴포넌트 마운트 시 모든 비디오 정지
    useEffect(() => {
        pauseAllVideos();
    }, []);

    // 현재 인덱스 변경 시에도 모든 비디오 정지 유지
    useEffect(() => {
        pauseAllVideos();
    }, [currentIndex]);

    // 키보드 이벤트 처리
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex]);

    // 터치 이벤트 처리
    useEffect(() => {
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        };

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    handleNext();
                } else {
                    handlePrevious();
                }
            }
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [currentIndex]);

    // 카드 클래스 계산 함수
    const getCardClass = (index) => {
        const offset = (index - currentIndex + teamMembers.length) % teamMembers.length;

        if (offset === 0) return 'center';
        if (offset === 1) return 'right-1';

        if (offset === teamMembers.length - 1) return 'left-1';
    };

    return (
        <section className="main_visual">
            <div className="team-carousel-wrapper-visual">
                <div className="carousel-container">
                    <button className="nav-arrow left" onClick={handlePrevious}>
                        <img src="/images/icons/big_right.png" alt="" />
                    </button>

                    <div className="carousel-track">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className={`card ${getCardClass(index)}`}
                                onClick={() => handleCardClick(index)}
                            >
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)}
                                    src={teamVideos[index]}
                                    muted
                                    playsInline
                                    preload="metadata"
                                    className="video-content"
                                    poster={teamVideos[index] + '#t=0.1'}
                                >
                                    Your browser does not support the video tag.
                                </video>
                                <div className="video-play-indicator">▶</div>
                                <div className="member-info">
                                    <h2 className="member-name">{member.name}</h2>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="nav-arrow right" onClick={handleNext}>
                        <img src="/images/icons/big_left.png" alt="" />
                    </button>
                </div>
            </div>
            <div className="big_text_bg">SOUNDS GOODS</div>
        </section>
    );
};

export default Main_visual;
