import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videosLoaded, setVideosLoaded] = useState(Array(teamMembers.length).fill(false));
    const videoRefs = useRef([]);
    const cardRefs = useRef([]);
    const fullscreenOverlayRef = useRef(null);

    // 비디오 로드 상태 업데이트
    const handleVideoLoad = (index) => {
        setVideosLoaded((prev) => {
            const newLoaded = [...prev];
            newLoaded[index] = true;
            return newLoaded;
        });
    };

    const updateCarousel = (newIndex) => {
        if (isAnimating || isFullscreen) return;
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

    const handleCardClick = (index) => {
        if (isFullscreen) {
            exitFullscreen();
            return;
        }

        if (index === currentIndex) {
            enterFullscreen(index);
        } else {
            updateCarousel(index);
        }
    };

    // 전체 화면 모드 진입
    const enterFullscreen = (index) => {
        if (isFullscreen) return;

        setIsFullscreen(true);
        const card = cardRefs.current[index];
        const video = videoRefs.current[index];

        if (!card || !video) return;

        // 전체 화면 오버레이 표시
        gsap.set(fullscreenOverlayRef.current, { display: 'block', opacity: 0 });

        // 카드의 원래 스타일 저장
        const originalStyle = {
            position: card.style.position,
            top: card.style.top,
            left: card.style.left,
            width: card.style.width,
            height: card.style.height,
            zIndex: card.style.zIndex,
        };

        card.dataset.originalStyle = JSON.stringify(originalStyle);

        // 카드 애니메이션
        const rect = card.getBoundingClientRect();
        const scaleX = window.innerWidth / rect.width;
        const scaleY = window.innerHeight / rect.height;
        const scale = Math.max(scaleX, scaleY);

        // 전체 화면을 위한 스타일 설정
        gsap.set(card, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: 1000,
        });

        gsap.to(card, {
            duration: 0.8,
            x: 0,
            y: 0,
            scale: scale,
            borderRadius: 0,
            ease: 'power3.inOut',
            onComplete: () => {
                video.play().catch(console.error);
            },
        });

        // 오버레이 페이드 인
        gsap.to(fullscreenOverlayRef.current, {
            duration: 0.5,
            opacity: 1,
            ease: 'power2.out',
        });
    };

    // 전체 화면 모드 종료 - 수정된 버전
    const exitFullscreen = () => {
        if (!isFullscreen) return;

        const card = cardRefs.current[currentIndex];
        const video = videoRefs.current[currentIndex];

        if (!card || !video) return;

        // 비디오 정지 및 초기화
        video.pause();
        video.currentTime = 0;

        // 카드 원래 위치로 복원
        gsap.to(card, {
            duration: 0.8,
            x: 0,
            y: 0,
            scale: 1,
            borderRadius: 20,
            ease: 'power3.inOut',
            onComplete: () => {
                // 원래 스타일 복원
                if (card.dataset.originalStyle) {
                    const originalStyle = JSON.parse(card.dataset.originalStyle);
                    gsap.set(card, {
                        clearProps: 'all', // 모든 GSAP 속성 제거
                    });

                    // CSS 스타일 복원
                    Object.keys(originalStyle).forEach((key) => {
                        card.style[key] = originalStyle[key];
                    });

                    // 데이터 속성 정리
                    delete card.dataset.originalStyle;
                }

                // 오버레이 페이드 아웃
                gsap.to(fullscreenOverlayRef.current, {
                    duration: 0.5,
                    opacity: 0,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.set(fullscreenOverlayRef.current, { display: 'none' });
                        setIsFullscreen(false);

                        // 카드 위치 강제 재설정을 위한 slight delay
                        setTimeout(() => {
                            // 현재 카드의 위치를 CSS 클래스로 강제 업데이트
                            cardRefs.current.forEach((card, index) => {
                                if (card) {
                                    // CSS 클래스 재적용을 위해 강제 리플로우
                                    card.classList.remove('center', 'right-1', 'left-1');
                                    void card.offsetWidth; // 리플로우 강제 실행

                                    const offset =
                                        (index - currentIndex + teamMembers.length) %
                                        teamMembers.length;
                                    if (offset === 0) {
                                        card.classList.add('center');
                                    } else if (offset === 1) {
                                        card.classList.add('right-1');
                                    } else if (offset === teamMembers.length - 1) {
                                        card.classList.add('left-1');
                                    }
                                }
                            });
                        }, 50);
                    },
                });
            },
        });
    };

    // ESC 키로 전체 화면 종료
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                exitFullscreen();
            } else if (e.key === 'ArrowLeft' && !isFullscreen) {
                handlePrevious();
            } else if (e.key === 'ArrowRight' && !isFullscreen) {
                handleNext();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex, isFullscreen]);

    // 모든 비디오 정지
    const pauseAllVideos = () => {
        videoRefs.current.forEach((video) => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    };

    // 컴포넌트 마운트 시 모든 비디오 정지
    useEffect(() => {
        pauseAllVideos();
    }, []);

    // 현재 인덱스 변경 시에도 모든 비디오 정지 유지
    useEffect(() => {
        if (!isFullscreen) {
            pauseAllVideos();
        }
    }, [currentIndex, isFullscreen]);

    // 터치 이벤트 처리 (전체 화면 모드에서는 비활성화)
    useEffect(() => {
        if (isFullscreen) return;

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
    }, [currentIndex, isFullscreen]);

    // 카드 클래스 계산 함수
    const getCardClass = (index) => {
        if (isFullscreen && index === currentIndex) return 'center fullscreen';

        const offset = (index - currentIndex + teamMembers.length) % teamMembers.length;

        if (offset === 0) return 'center';
        if (offset === 1) return 'right-1';
        if (offset === teamMembers.length - 1) return 'left-1';

        return 'hidden';
    };

    return (
        <section className="main_visual">
            <div className="team-carousel-wrapper-visual">
                <div className="carousel-container">
                    <button
                        className="nav-arrow left"
                        onClick={handlePrevious}
                        style={{ display: isFullscreen ? 'none' : 'flex' }}
                    >
                        <img src="/images/icons/big_right.png" alt="" />
                    </button>

                    <div className="carousel-track">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                ref={(el) => (cardRefs.current[index] = el)}
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
                                    onLoadedData={() => handleVideoLoad(index)}
                                    onError={(e) => {
                                        console.error('Video load error:', e);
                                    }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                                <div className="member-info">
                                    <h2 className="member-name">{member.name}</h2>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="nav-arrow right"
                        onClick={handleNext}
                        style={{ display: isFullscreen ? 'none' : 'flex' }}
                    >
                        <img src="/images/icons/big_left.png" alt="" />
                    </button>
                </div>
            </div>

            {/* 전체 화면 오버레이 */}
            <div
                ref={fullscreenOverlayRef}
                className="fullscreen-overlay"
                onClick={exitFullscreen}
                style={{ display: 'none' }}
            >
                <button className="close-fullscreen">
                    <span>×</span>
                </button>
            </div>

            <div className="big_text_bg">SOUNDS GOODS</div>
        </section>
    );
};

export default Main_visual;
