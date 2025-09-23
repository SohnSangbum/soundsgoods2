import './style.scss';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger, useGSAP);

const vis = [
    {
        id: 1,
        video: 'https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_to.mp4',
        right: 'Play',
        left: 'It',
        class: 'first',
    },
    {
        id: 2,
        video: 'https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_to.mp4',
        right: 'Feel',
        left: 'It',
        class: 'second',
    },
    {
        id: 3,
        video: 'https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_to.mp4',
        right: 'Love',
        left: 'It',
        class: 'third',
    },
];

const Main_visual = ({ onVideoPlay }) => {
    const titleRef = useRef();
    const titleRef2 = useRef();
    const titleRef3 = useRef();
    const titleRef4 = useRef();
    const titleRef5 = useRef();
    const titleRef6 = useRef();
    const titleRef7 = useRef();
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const originalSizes = useRef({
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        scrollY: 0,
    });
    const scrollTriggerRef = useRef(null);
    const videoRefs = useRef([]);
    const fullscreenVideoRef = useRef(null);
    const isScrollLocked = useRef(false);

    // 비디오 ref 초기화
    useEffect(() => {
        videoRefs.current = videoRefs.current.slice(0, vis.length);
    }, []);

    // 비디오 상태 관리
    useEffect(() => {
        if (!showVideo && fullscreenVideoRef.current) {
            // 전체 화면 비디오가 닫힐 때 완전히 정지
            fullscreenVideoRef.current.pause();
            fullscreenVideoRef.current.currentTime = 0;
        }
    }, [showVideo]);

    // 썸네일 비디오 자동 재생 방지
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video && !isExpanded) {
                video.pause();
                video.currentTime = 0.1;
            }
        });
    }, [isExpanded]);

    const handleVideoClick = (item, index) => {
        // 3번째 비디오만 확대 효과 적용
        if (item.id === 3 && !isExpanded) {
            // 비디오 재생 상태 알림
            if (onVideoPlay) {
                onVideoPlay(true);
            }

            const scrollY = window.scrollY;
            originalSizes.current.scrollY = scrollY;

            setIsExpanded(true);
            isScrollLocked.current = true;

            const visualElement = document.querySelector(`.${item.class}_visual`);
            const videoContainer = visualElement.querySelector('.video-container');
            const textElements = visualElement.querySelectorAll('strong');

            const rect = videoContainer.getBoundingClientRect();

            originalSizes.current = {
                ...originalSizes.current,
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top,
            };

            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.disable();
            }

            document.body.classList.add('scroll-locked');
            document.documentElement.style.scrollBehavior = 'auto';

            const header = document.querySelector('header');
            if (header) {
                header.classList.add('hidden');
            }

            // 다른 visual 요소 숨기기
            gsap.utils.toArray('.visual').forEach((visual, i) => {
                if (i !== 2) {
                    gsap.to(visual, {
                        opacity: 0,
                        duration: 0.5,
                    });
                }
            });

            // 텍스트 숨기기
            gsap.to(textElements, {
                opacity: 0,
                duration: 0.5,
            });

            // 현재 썸네일 비디오 일시정지
            if (videoRefs.current[index]) {
                videoRefs.current[index].pause();
                videoRefs.current[index].currentTime = 0.1;
            }

            gsap.set(visualElement, {
                x: 0,
                y: 0,
                scale: 1,
            });

            gsap.set(videoContainer, {
                position: 'fixed',
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                zIndex: 1000,
            });

            gsap.to(videoContainer, {
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                width: '100vw',
                height: '100vh',
                borderRadius: 0,
                duration: 1,
                onComplete: () => {
                    setShowVideo(true);
                    setTimeout(() => {
                        if (fullscreenVideoRef.current) {
                            fullscreenVideoRef.current.currentTime = 0;
                            fullscreenVideoRef.current
                                .play()
                                .catch((e) => console.log('Autoplay prevented:', e));
                        }
                    }, 100);
                },
            });
        }
    };

    const handleCloseVideo = () => {
        if (fullscreenVideoRef.current) {
            fullscreenVideoRef.current.pause();
            fullscreenVideoRef.current.currentTime = 0; // 현재 시간 초기화
        }

        setShowVideo(false);

        if (onVideoPlay) {
            onVideoPlay(false);
        }

        const header = document.querySelector('header');
        if (header) {
            header.classList.remove('hidden');
        }

        const visualElement = document.querySelector('.third_visual');
        const videoContainer = visualElement.querySelector('.video-container');
        const textElements = visualElement.querySelectorAll('strong');

        gsap.to(videoContainer, {
            left: originalSizes.current.left,
            top: originalSizes.current.top,
            width: originalSizes.current.width,
            height: originalSizes.current.height,
            borderRadius: 8,
            duration: 0.8,
            onComplete: () => {
                gsap.set(videoContainer, {
                    position: 'relative',
                    left: 'auto',
                    top: 'auto',
                    x: 0,
                    y: 0,
                    zIndex: 2,
                });

                gsap.to(textElements, {
                    opacity: 1,
                    duration: 0.5,
                });

                gsap.utils.toArray('.visual').forEach((visual) => {
                    gsap.to(visual, {
                        opacity: 1,
                        duration: 0.5,
                    });
                });

                // 썸네일 비디오 복구 - 현재 시간을 0.1로 설정하고 정지
                const thumbnailVideo = videoRefs.current[2];
                if (thumbnailVideo) {
                    thumbnailVideo.currentTime = 0.1; // 첫 프레임으로 설정
                    setTimeout(() => {
                        thumbnailVideo.pause(); // 정지
                    }, 100);
                }

                document.body.classList.remove('scroll-locked');
                document.documentElement.style.scrollBehavior = '';

                window.scrollTo(0, originalSizes.current.scrollY);

                if (scrollTriggerRef.current) {
                    scrollTriggerRef.current.enable();
                    setTimeout(() => {
                        ScrollTrigger.refresh();
                    }, 100);
                }

                setIsExpanded(false);
                isScrollLocked.current = false;
            },
        });
    };

    // 비디오 재생 시 텍스트 애니메이션
    useEffect(() => {
        if (showVideo) {
            const tl = gsap.timeline();

            tl.to(titleRef.current, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
            })
                .to(
                    titleRef.current,
                    {
                        x: '-95%',
                        fontSize: 80,
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '>'
                )
                .fromTo(
                    titleRef2.current,
                    {
                        x: '100%',
                        opacity: 0,
                        scale: 1,
                    },
                    {
                        x: '0%',
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '<'
                )
                .to(
                    titleRef2.current,
                    {
                        opacity: 1,
                        duration: 0.1,
                    },
                    '>0.4'
                )
                .fromTo(
                    titleRef3.current,
                    {
                        y: '100%',
                        opacity: 0,
                    },
                    {
                        y: '0%',
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '<'
                )
                .to(
                    titleRef.current,
                    {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '>0.5'
                )
                .to(
                    [titleRef2.current],
                    {
                        x: '-120%',
                        rotation: -90,
                        transformOrigin: 'center center',
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '<'
                )
                .to(
                    [titleRef3.current],
                    {
                        x: '-185%',
                        rotation: -90,
                        transformOrigin: 'center center',
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '<'
                )
                .fromTo(
                    titleRef4.current,
                    {
                        x: '100%',
                        opacity: 0,
                    },
                    {
                        x: '0',
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '>'
                )
                .fromTo(
                    titleRef5.current,
                    {
                        x: '100%',
                        opacity: 0,
                    },
                    {
                        x: '0',
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '>'
                )
                .fromTo(
                    titleRef6.current,
                    {
                        x: '100%',
                        opacity: 0,
                    },
                    {
                        x: '0',
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '>'
                )
                .to(
                    [titleRef2.current, titleRef3.current],
                    {
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                    },
                    '>'
                )
                .to(
                    [titleRef4.current, titleRef5.current, titleRef6.current],
                    {
                        x: '-650',
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '>'
                )
                .to(
                    [titleRef4.current, titleRef5.current, titleRef6.current],
                    {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '>0.2'
                )
                .fromTo(
                    titleRef7.current,
                    {
                        x: '-100%',
                        opacity: 0,
                    },
                    {
                        x: '0%',
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '>'
                );
        }
    }, [showVideo]);

    const initScrollTrigger = () => {
        ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.trigger === sectionRef.current) {
                trigger.kill();
            }
        });

        const visuals = gsap.utils.toArray('.visual');
        const totalSlides = visuals.length;
        const slideHeight = window.innerHeight;

        gsap.set(visuals, {
            zIndex: (i) => (i === 0 ? 10 : 5 - i),
        });

        gsap.set(visuals[0], {
            opacity: 1,
            scale: 1,
            y: 0,
            z: 0,
        });

        gsap.set(visuals[1], {
            opacity: 0.8,
            scale: 0.9,
            y: -slideHeight * 0.2,
            z: -150,
        });

        gsap.set(visuals[2], {
            opacity: 0.8,
            scale: 0.9,
            y: slideHeight * 0.2,
            z: -300,
        });

        gsap.set('.visual strong', {
            opacity: 0,
            y: 15,
        });

        gsap.set(visuals[0].querySelectorAll('strong'), {
            opacity: 1,
            y: 0,
        });

        scrollTriggerRef.current = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top +=150',
            end: () => `+=${slideHeight * (totalSlides - 1)}`,
            pin: true,
            scrub: 1,
            markers: false,
            onUpdate: (self) => {
                if (isScrollLocked.current) {
                    return;
                }

                const progress = Math.min(Math.max(self.progress, 0), 1);
                const activeIndex = Math.min(Math.floor(progress * totalSlides), totalSlides - 1);
                setCurrentSlide(activeIndex);

                visuals.forEach((visual, i) => {
                    let targetY = 0;
                    let targetZ = 0;
                    let targetOpacity = 0.8;
                    let targetScale = 0.9;
                    let textOpacity = 0;

                    if (i === activeIndex) {
                        targetY = 0;
                        targetZ = 0;
                        targetOpacity = 1;
                        targetScale = 1;
                        textOpacity = 1;
                    } else if (i === (activeIndex + 1) % totalSlides) {
                        targetY = -slideHeight * 0.2;
                        targetZ = -150;
                    } else {
                        targetY = slideHeight * 0.2;
                        targetZ = -300;
                    }

                    gsap.to(visual, {
                        y: targetY,
                        z: targetZ,
                        opacity: targetOpacity,
                        scale: targetScale,
                        duration: 0.5,
                    });

                    gsap.to(visual.querySelectorAll('strong'), {
                        opacity: textOpacity,
                        y: textOpacity ? 0 : 15,
                        duration: 0.3,
                    });

                    gsap.set(visual, {
                        zIndex: i === activeIndex ? 10 : 5 - Math.abs(i - activeIndex),
                    });
                });
            },
        });
    };

    useGSAP(
        () => {
            if (isExpanded) return;
            initScrollTrigger();

            const handleResize = () => {
                if (!isExpanded) {
                    initScrollTrigger();
                }
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        },
        { scope: sectionRef, dependencies: [isExpanded] }
    );

    useEffect(() => {
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            document.body.classList.remove('scroll-locked');
            document.documentElement.style.scrollBehavior = '';

            const header = document.querySelector('header');
            if (header && header.classList.contains('hidden')) {
                header.classList.remove('hidden');
            }

            if (onVideoPlay) {
                onVideoPlay(false);
            }

            // 컴포넌트 언마운트 시 모든 비디오 정지
            videoRefs.current.forEach((video) => {
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            });

            if (fullscreenVideoRef.current) {
                fullscreenVideoRef.current.pause();
                fullscreenVideoRef.current.currentTime = 0;
            }
        };
    }, []);

    return (
        <section id="main-visual" ref={sectionRef}>
            <div className="visual_wrap" ref={containerRef}>
                {vis.map((item, index) => (
                    <div
                        className={`visual ${item.class}_visual ${
                            isExpanded && item.id === 3 ? 'expanded' : ''
                        }`}
                        key={item.id}
                        onClick={() => handleVideoClick(item, index)}
                    >
                        <strong className="right-text">{item.right}</strong>
                        <div className="video-container">
                            <video
                                ref={(el) => (videoRefs.current[index] = el)}
                                src={item.video}
                                muted
                                playsInline
                                preload="metadata"
                                onLoadedData={(e) => {
                                    e.target.currentTime = 0.1;
                                    setTimeout(() => e.target.pause(), 100);
                                }}
                                onPlay={(e) => {
                                    // 확대 상태가 아닐 때는 자동 재생 방지
                                    if (!isExpanded && e.target !== fullscreenVideoRef.current) {
                                        e.target.pause();
                                        e.target.currentTime = 0.1;
                                    }
                                }}
                            />
                        </div>
                        <strong className="left-text">{item.left}</strong>
                    </div>
                ))}
            </div>

            {showVideo && (
                <div className="video_fullscreen" onClick={handleCloseVideo}>
                    <strong className="title_1" ref={titleRef}>
                        당신의 playlist가
                    </strong>
                    <strong className="title_2" ref={titleRef2}>
                        아티스트와 연결되는
                    </strong>
                    <strong className="title_3" ref={titleRef3}>
                        순간
                    </strong>
                    <strong className="title_4" ref={titleRef4}>
                        Good People,
                    </strong>
                    <strong className="title_5" ref={titleRef5}>
                        Good Music,
                    </strong>
                    <strong className="title_6" ref={titleRef6}>
                        Good Moments.
                    </strong>
                    <strong className="title_7" ref={titleRef7}>
                        SOUNDS GOODS
                    </strong>
                    <video
                        ref={fullscreenVideoRef}
                        src="https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_to.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                </div>
            )}
        </section>
    );
};

export default Main_visual;
