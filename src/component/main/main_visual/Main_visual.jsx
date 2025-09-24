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
    const videoRefs = useRef([]);
    const cardRefs = useRef([]);
    const fullscreenOverlayRef = useRef(null);
    const cloneRef = useRef(null);
    const tlTextRef = useRef([]);
    const textAnimationRef = useRef(null);

    const updateCarousel = (newIndex) => {
        if (isAnimating || isFullscreen) return;
        setIsAnimating(true);

        const index = (newIndex + teamMembers.length) % teamMembers.length;
        setCurrentIndex(index);

        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    };

    const handlePrevious = () => updateCarousel(currentIndex - 1);
    const handleNext = () => updateCarousel(currentIndex + 1);

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

    // 텍스트 애니메이션 실행 (더 빠르게)
    const runTextAnimation = () => {
        if (textAnimationRef.current) {
            textAnimationRef.current.kill();
        }

        textAnimationRef.current = gsap.timeline();

        textAnimationRef.current
            .fromTo(
                tlTextRef.current[0],
                { opacity: 0, scale: 0.8 },
                {
                    duration: 0.4,
                    opacity: 1,
                    scale: 1,
                    ease: 'power2.out',
                }
            )
            .to(
                tlTextRef.current[0],
                {
                    duration: 0.6,
                    x: -200,
                    scale: 0.7,
                    ease: 'power2.inOut',
                },
                0.2
            )
            .fromTo(
                tlTextRef.current[1],
                { opacity: 0, x: 300 },
                {
                    duration: 0.6,
                    opacity: 1,
                    x: 0,
                    ease: 'power2.out',
                },
                0.2
            )
            .fromTo(
                '.tl_3',
                { opacity: 0, y: 50 },
                {
                    duration: 0.4,
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out',
                },
                0.4
            )
            .fromTo(
                '.tl_4',
                { opacity: 0, y: 50 },
                {
                    duration: 0.4,
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out',
                },
                0.5
            )
            .fromTo(
                '.tl_5',
                { opacity: 0, y: 50 },
                {
                    duration: 0.4,
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out',
                },
                0.6
            )
            .fromTo(
                '.tl_6',
                { opacity: 0, y: 50 },
                {
                    duration: 0.4,
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out',
                },
                0.7
            )
            .fromTo(
                '.tl_7',
                { opacity: 0, scale: 0.8 },
                {
                    duration: 0.5,
                    opacity: 1,
                    scale: 1,
                    ease: 'back.out(1.7)',
                },
                0.8
            );

        return textAnimationRef.current;
    };

    // 전체 화면 모드 진입 (비디오 재생 타이밍 최적화)
    const enterFullscreen = (index) => {
        if (isAnimating || isFullscreen) return;

        setIsAnimating(true);
        setIsFullscreen(true);

        const originalCard = cardRefs.current[index];
        const video = videoRefs.current[index];

        if (!originalCard || !video) return;

        originalCard.style.visibility = 'hidden';

        const rect = originalCard.getBoundingClientRect();
        const clone = originalCard.cloneNode(true);
        clone.classList.add('fullscreen-clone');

        const memberInfo = clone.querySelector('.member-info');
        if (memberInfo) {
            memberInfo.style.display = 'none';
        }

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        Object.assign(clone.style, {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: '0',
            transform: 'none',
            transformOrigin: 'center center',
            zIndex: '1000',
            visibility: 'visible',
        });

        document.body.appendChild(clone);
        cloneRef.current = clone;

        const cloneVideo = clone.querySelector('video');
        if (cloneVideo) {
            cloneVideo.src = video.src;
            cloneVideo.muted = true;
            cloneVideo.playsInline = true;
            // 클론 비디오 미리 재생 준비
            cloneVideo.load();
        }

        const targetScale =
            Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.02;
        const moveX = screenCenterX - centerX;
        const moveY = screenCenterY - centerY;

        // 오버레이 설정
        gsap.set(fullscreenOverlayRef.current, {
            display: 'block',
            opacity: 0,
            pointerEvents: 'auto',
        });

        // 텍스트 초기 위치 조정
        gsap.set(tlTextRef.current, {
            opacity: 0,
            x: 0,
            y: 0,
            scale: 1,
            display: 'block',
            zIndex: 1001,
        });

        gsap.set(tlTextRef.current[1], { x: 300 });
        gsap.set('.tl_3', { opacity: 0, y: 50 });
        gsap.set('.tl_4', { opacity: 0, y: 50 });
        gsap.set('.tl_5', { opacity: 0, y: 50 });
        gsap.set('.tl_6', { opacity: 0, y: 50 });
        gsap.set('.tl_7', { opacity: 0, scale: 0.8 });

        gsap.set(clone, {
            x: 0,
            y: 0,
            scale: 1,
            borderRadius: 20,
        });

        // 비디오 미리 재생 시작 (애니메이션 완료를 기다리지 않음)
        const playVideo = () => {
            video.play().catch(console.error);
            if (cloneVideo) {
                cloneVideo.play().catch(console.error);
            }
        };

        const masterTimeline = gsap.timeline({
            onStart: playVideo, // 애니메이션 시작과 동시에 비디오 재생
            onComplete: () => {
                setIsAnimating(false);
            },
        });

        // 더 빠른 애니메이션
        masterTimeline.to(clone, {
            duration: 0.5,
            x: moveX,
            y: moveY,
            scale: targetScale,
            borderRadius: 0,
            ease: 'power3.inOut',
        });

        masterTimeline.to(
            fullscreenOverlayRef.current,
            {
                duration: 0.2,
                opacity: 1,
                ease: 'power2.out',
            },
            0.1
        );

        masterTimeline.add(runTextAnimation(), 0.2); // 텍스트 애니메이션도 더 빠르게 시작
    };

    // 전체 화면 모드 종료
    const exitFullscreen = () => {
        if (isAnimating || !isFullscreen) return;

        setIsAnimating(true);

        const originalCard = cardRefs.current[currentIndex];
        const video = videoRefs.current[currentIndex];
        const clone = cloneRef.current;

        if (!clone || !video) return;

        // 비디오 즉시 정지
        video.pause();
        video.currentTime = 0;

        const cloneVideo = clone.querySelector('video');
        if (cloneVideo) {
            cloneVideo.pause();
            cloneVideo.currentTime = 0;
        }

        if (textAnimationRef.current) {
            textAnimationRef.current.kill();
        }

        // 텍스트 빠르게 사라지게
        gsap.to([tlTextRef.current, '.tl_3', '.tl_4', '.tl_5', '.tl_6', '.tl_7'], {
            duration: 0.15,
            opacity: 0,
            ease: 'power2.in',
        });

        // 빠른 복원 애니메이션
        gsap.to(clone, {
            duration: 0.5,
            x: 0,
            y: 0,
            scale: 1,
            borderRadius: 20,
            ease: 'power3.inOut',
            onComplete: () => {
                if (clone.parentNode) {
                    clone.parentNode.removeChild(clone);
                }
                cloneRef.current = null;

                if (originalCard) {
                    originalCard.style.visibility = 'visible';
                }

                gsap.to(fullscreenOverlayRef.current, {
                    duration: 0.15,
                    opacity: 0,
                    onComplete: () => {
                        gsap.set(fullscreenOverlayRef.current, {
                            display: 'none',
                            pointerEvents: 'none',
                        });
                        setIsFullscreen(false);
                        setIsAnimating(false);
                    },
                });
            },
        });
    };

    // ESC 키 처리
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                exitFullscreen();
            } else if (e.key === 'ArrowLeft' && !isFullscreen && !isAnimating) {
                handlePrevious();
            } else if (e.key === 'ArrowRight' && !isFullscreen && !isAnimating) {
                handleNext();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, isFullscreen, isAnimating]);

    // 모든 비디오 정지
    const pauseAllVideos = () => {
        videoRefs.current.forEach((video) => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    };

    useEffect(() => {
        pauseAllVideos();
    }, []);

    useEffect(() => {
        if (!isFullscreen) {
            pauseAllVideos();
        }
    }, [currentIndex, isFullscreen]);

    // 터치 이벤트
    useEffect(() => {
        if (isFullscreen || isAnimating) return;

        let touchStartX = 0;
        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };
        const handleTouchEnd = (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? handleNext() : handlePrevious();
            }
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [currentIndex, isFullscreen, isAnimating]);

    // 카드 클래스 계산
    const getCardClass = (index) => {
        if (isFullscreen && index === currentIndex) return 'center';

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
                        disabled={isAnimating || isFullscreen}
                        style={{
                            display: isFullscreen ? 'none' : 'flex',
                            opacity: isAnimating ? 0.5 : 1,
                        }}
                    >
                        <img src="/images/icons/big_right.png" alt="Previous" />
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
                                    preload="auto"
                                    className="video-content"
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
                        disabled={isAnimating || isFullscreen}
                        style={{
                            display: isFullscreen ? 'none' : 'flex',
                            opacity: isAnimating ? 0.5 : 1,
                        }}
                    >
                        <img src="/images/icons/big_left.png" alt="Next" />
                    </button>
                </div>
            </div>

            <div
                ref={fullscreenOverlayRef}
                className="fullscreen-overlay"
                onClick={exitFullscreen}
                style={{ display: 'none' }}
            >
                <button className="close-fullscreen">
                    <span>×</span>
                </button>
                <strong ref={(el) => (tlTextRef.current[0] = el)} className="tl tl_1">
                    당신의 playlist가
                </strong>
                <strong ref={(el) => (tlTextRef.current[1] = el)} className="tl tl_2">
                    아티스트와 연결되는
                </strong>
                <strong className="tl tl_3">순간</strong>
                <strong className="tl tl_4">Good People,</strong>
                <strong className="tl tl_5">Good Music,</strong>
                <strong className="tl tl_6">Good Moments.</strong>
                <strong className="tl tl_7">sounds goods</strong>
            </div>

            <div className="big_text_bg">SOUNDS GOODS</div>
        </section>
    );
};

export default Main_visual;
