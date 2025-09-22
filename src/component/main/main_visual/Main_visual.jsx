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
        img: '/images/main/visual00.jpg',
        right: 'Play',
        left: 'It',
        class: 'first',
    },
    {
        id: 2,
        img: '/images/main/visual02.jpg',
        right: 'Feel',
        left: 'It',
        class: 'second',
    },
    {
        id: 3,
        img: '/images/main/visual03.jpg',
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
    const videoRef = useRef(null);
    const isScrollLocked = useRef(false);

    const handleImageClick = (item) => {
        // 3번째 이미지만 확대 효과 적용
        if (item.id === 3 && !isExpanded) {
            // 비디오 재생 상태 알림
            if (onVideoPlay) {
                onVideoPlay(true);
            }

            // 현재 스크롤 위치 저장
            const scrollY = window.scrollY;
            originalSizes.current.scrollY = scrollY;

            setIsExpanded(true);
            isScrollLocked.current = true;

            const visualElement = document.querySelector(`.${item.class}_visual`);
            const picElement = visualElement.querySelector('.pic');
            const textElements = visualElement.querySelectorAll('strong');

            // 뷰포트와 요소의 중앙 계산
            const rect = picElement.getBoundingClientRect();

            // 요소의 현재 위치와 크기 저장
            originalSizes.current = {
                ...originalSizes.current,
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top,
            };

            // 스크롤 트리거 일시 중지 (kill 대신 disable 사용)
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.disable();
            }

            // 스크롤 잠금 (body에 클래스 추가 방식으로 변경)
            document.body.classList.add('scroll-locked');
            document.documentElement.style.scrollBehavior = 'auto';

            // 헤더 숨기기
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

            // 부모 컨테이너의 transform 초기화
            gsap.set(visualElement, {
                x: 0,
                y: 0,
                scale: 1,
            });

            // 이미지를 절대 위치로 변경하여 전체 화면에서 중앙 정렬
            gsap.set(picElement, {
                position: 'fixed',
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                zIndex: 1000,
            });

            // 이미지 확대 및 중앙 정렬
            gsap.to(picElement, {
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                width: '100vw',
                height: '100vh',
                borderRadius: 0,
                duration: 1,
                onComplete: () => {
                    // 비디오 표시 및 재생
                    setShowVideo(true);

                    // 비디오 자동 재생
                    setTimeout(() => {
                        if (videoRef.current) {
                            videoRef.current
                                .play()
                                .catch((e) => console.log('Autoplay prevented:', e));
                        }
                    }, 100);
                },
            });
        }
    };

    const handleCloseVideo = () => {
        // 비디오 일시정지
        if (videoRef.current) {
            videoRef.current.pause();
        }

        setShowVideo(false);

        // 비디오 재생 종료 상태 알림
        if (onVideoPlay) {
            onVideoPlay(false);
        }

        // 헤더 다시 표시
        const header = document.querySelector('header');
        if (header) {
            header.classList.remove('hidden');
        }

        const visualElement = document.querySelector('.third_visual');
        const picElement = visualElement.querySelector('.pic');
        const textElements = visualElement.querySelectorAll('strong');

        // 이미지 원래 위치와 크기로 복구
        gsap.to(picElement, {
            left: originalSizes.current.left,
            top: originalSizes.current.top,
            width: originalSizes.current.width,
            height: originalSizes.current.height,
            borderRadius: 8,
            duration: 0.8,
            onComplete: () => {
                // 원래 상태로 복구
                gsap.set(picElement, {
                    position: 'relative',
                    left: 'auto',
                    top: 'auto',
                    x: 0,
                    y: 0,
                    zIndex: 2,
                });

                // 텍스트 다시 표시
                gsap.to(textElements, {
                    opacity: 1,
                    duration: 0.5,
                });

                // 모든 visual 요소 다시 표시
                gsap.utils.toArray('.visual').forEach((visual) => {
                    gsap.to(visual, {
                        opacity: 1,
                        duration: 0.5,
                    });
                });

                // 스크롤 잠금 해제
                document.body.classList.remove('scroll-locked');
                document.documentElement.style.scrollBehavior = '';

                // 원래 스크롤 위치로 복원
                window.scrollTo(0, originalSizes.current.scrollY);

                // 스크롤 트리거 다시 활성화
                if (scrollTriggerRef.current) {
                    scrollTriggerRef.current.enable();
                    // 스크롤 트리거 새로고침
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
    // 비디오 재생 시 텍스트 애니메이션
    // 비디오 재생 시 텍스트 애니메이션
    // 비디오 재생 시 텍스트 애니메이션
    useEffect(() => {
        if (showVideo) {
            const tl = gsap.timeline();

            // title_1이 먼저 나타남
            tl.to(titleRef.current, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
            })
                // title_2가 오른쪽에서 나타나고, title_1이 왼쪽로 이동하며 크기 줄어듦
                .to(
                    titleRef.current,
                    {
                        x: '-140%',
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
                // 0.4초 뒤에 title_3가 아래에서 나타남
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
                // 0.5초 뒤에 title_1 사라지고, title_2와 title_3가 세로로 바뀌며 왼쪽으로 이동
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
                // title_4,5,6가 오른쪽에서 나타남
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
                // title_6까지 다 나타나면 title_2, title_3 사라짐
                .to(
                    [titleRef2.current, titleRef3.current],
                    {
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                    },
                    '>'
                )
                // title_2, title_3 사라지는게 끝나면 title_4,5,6이 왼쪽으로 이동
                .to(
                    [titleRef4.current, titleRef5.current, titleRef6.current],
                    {
                        x: '-650',
                        duration: 1,
                        ease: 'power2.out',
                    },
                    '>'
                )
                // 0.2초 뒤에 title_4,5,6 사라짐
                .to(
                    [titleRef4.current, titleRef5.current, titleRef6.current],
                    {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '>0.2'
                )
                // title_4,5,6 사라진 후 title_7가 왼쪽에서 나타남
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
        // 기존 스크롤 트리거 모두 제거
        ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.trigger === sectionRef.current) {
                trigger.kill();
            }
        });

        const visuals = gsap.utils.toArray('.visual');
        const totalSlides = visuals.length;
        const slideHeight = window.innerHeight;

        // 초기 상태 설정
        gsap.set(visuals, {
            zIndex: (i) => (i === 0 ? 10 : 5 - i),
        });

        // 첫 번째 슬라이드 (센터)
        gsap.set(visuals[0], {
            opacity: 1,
            scale: 1,
            y: 0,
            z: 0,
        });

        // 두 번째 슬라이드 (위)
        gsap.set(visuals[1], {
            opacity: 0.8,
            scale: 0.9,
            y: -slideHeight * 0.2,
            z: -150,
        });

        // 세 번째 슬라이드 (아래)
        gsap.set(visuals[2], {
            opacity: 0.8,
            scale: 0.9,
            y: slideHeight * 0.2,
            z: -300,
        });

        // 텍스트 초기 상태
        gsap.set('.visual strong', {
            opacity: 0,
            y: 15,
        });

        // 중앙 슬라이드 텍스트만 보이게
        gsap.set(visuals[0].querySelectorAll('strong'), {
            opacity: 1,
            y: 0,
        });

        // 스크롤 트리거 설정
        scrollTriggerRef.current = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
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

            // 창 크기 변경 시 스크롤 트리거 갱신
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

    // 컴포넌트 언마운트 시 스크롤 트리거 정리
    useEffect(() => {
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            document.body.classList.remove('scroll-locked');
            document.documentElement.style.scrollBehavior = '';

            // 헤더 다시 표시
            const header = document.querySelector('header');
            if (header && header.classList.contains('hidden')) {
                header.classList.remove('hidden');
            }

            // 비디오 재생 종료 상태 알림
            if (onVideoPlay) {
                onVideoPlay(false);
            }
        };
    }, []);

    return (
        <section id="main-visual" ref={sectionRef}>
            <div className="visual_wrap" ref={containerRef}>
                {vis.map((item) => (
                    <div
                        className={`visual ${item.class}_visual ${
                            isExpanded && item.id === 3 ? 'expanded' : ''
                        }`}
                        key={item.id}
                        onClick={() => handleImageClick(item)}
                    >
                        <strong className="right-text">{item.right}</strong>
                        <div className="pic">
                            <img src={item.img} alt={item.right} />
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
                        ref={videoRef}
                        src="https://github.com/SongTam-tam/SoundsGoods_image/raw/main/videos/main_visual.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                    ></video>
                </div>
            )}
        </section>
    );
};

export default Main_visual;
