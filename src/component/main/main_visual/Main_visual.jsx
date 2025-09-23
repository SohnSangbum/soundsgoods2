import './style.scss';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Mousewheel, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';

const vis = [
    {
        id: 1,
        video: 'https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_tooo.MOV',
        right: 'Love',
        left: 'It',
        class: 'third',
    },
    {
        id: 2,
        video: 'https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_too.mov',
        right: 'Feel',
        left: 'It',
        class: 'second',
    },
    {
        id: 3,
        video: 'https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual_to.mp4',
        right: 'Play',
        left: 'It',
        class: 'first',
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const originalSizes = useRef({
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        scrollY: 0,
    });
    const videoRefs = useRef([]);
    const fullscreenVideoRef = useRef(null);
    const swiperRef = useRef(null);

    // 비디오 ref 초기화
    useEffect(() => {
        videoRefs.current = videoRefs.current.slice(0, vis.length);
    }, []);

    // 비디오 상태 관리
    useEffect(() => {
        if (!showVideo && fullscreenVideoRef.current) {
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
        if (item.id === 3 && !isExpanded) {
            if (onVideoPlay) {
                onVideoPlay(true);
            }

            const scrollY = window.scrollY;
            originalSizes.current.scrollY = scrollY;

            setIsExpanded(true);

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
            fullscreenVideoRef.current.currentTime = 0;
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

                // 썸네일 비디오 복구
                const thumbnailVideo = videoRefs.current[2];
                if (thumbnailVideo) {
                    thumbnailVideo.currentTime = 0.1;
                    setTimeout(() => {
                        thumbnailVideo.pause();
                    }, 100);
                }

                document.body.classList.remove('scroll-locked');
                document.documentElement.style.scrollBehavior = '';

                window.scrollTo(0, originalSizes.current.scrollY);

                setIsExpanded(false);
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

    useEffect(() => {
        return () => {
            document.body.classList.remove('scroll-locked');
            document.documentElement.style.scrollBehavior = '';

            const header = document.querySelector('header');
            if (header && header.classList.contains('hidden')) {
                header.classList.remove('hidden');
            }

            if (onVideoPlay) {
                onVideoPlay(false);
            }

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
            {/* Swiper에 중앙 확대 효과 적용 */}
            <Swiper
                ref={swiperRef}
                modules={[Navigation, Autoplay, Mousewheel]}
                centeredSlides={true}
                loop={true}
                speed={500}
                slidesPerView={1.5}
                spaceBetween={40}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                mousewheel={true}
                breakpoints={{
                    640: {
                        slidesPerView: 2.5,
                    },
                    768: {
                        slidesPerView: 2.75,
                    },
                    1080: {
                        slidesPerView: 3.25,
                    },
                    1280: {
                        slidesPerView: 3.75,
                    },
                }}
                className="swiper-visual"
                onSlideChangeTransitionStart={(swiper) => {
                    // 슬라이드 전환 시작 시 효과 적용
                    const slides = document.querySelectorAll('.swiper-slide');
                    slides.forEach((slide, index) => {
                        if (index === swiper.activeIndex) {
                            // 활성 슬라이드 확대
                            gsap.to(slide, {
                                scale: 1.5,
                                opacity: 1,
                                zIndex: 1,
                                duration: 0.7,
                                ease: 'power2.out',
                            });
                        } else {
                            // 비활성 슬라이드 축소
                            gsap.to(slide, {
                                scale: 1,
                                opacity: 0.4,
                                zIndex: 0,
                                duration: 0.7,
                                ease: 'power2.out',
                            });
                        }
                    });
                }}
                onInit={(swiper) => {
                    // 초기화 시 활성 슬라이드에 효과 적용
                    const activeSlide = document.querySelector('.swiper-slide-active');
                    if (activeSlide) {
                        gsap.set(activeSlide, {
                            scale: 1.5,
                            opacity: 1,
                            zIndex: 1,
                        });
                    }
                }}
            >
                {vis.map((item, index) => (
                    <SwiperSlide key={item.id}>
                        <div
                            className={`visual ${item.class}_visual ${
                                isExpanded && item.id === 3 ? 'expanded' : ''
                            }`}
                            onClick={() => handleVideoClick(item, index)}
                        >
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
                                        if (
                                            !isExpanded &&
                                            e.target !== fullscreenVideoRef.current
                                        ) {
                                            e.target.pause();
                                            e.target.currentTime = 0.1;
                                        }
                                    }}
                                />
                            </div>
                            <strong className="right-text">{item.right}</strong>
                            <strong className="left-text">{item.left}</strong>
                        </div>
                    </SwiperSlide>
                ))}
                {/* 네비게이션 버튼 추가 */}
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
            </Swiper>

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
