import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import cardList from '../../../assets/api/cardData';

const MainCard = () => {
    const sectionRef = useRef(null);
    const cardsRef = useRef(null);
    const con1CardsRef = useRef([]);
    const con3HeaderRef = useRef(null);
    const cardRefs = useRef([]);
    const mobileCardRefs = useRef([]);
    const svgRef = useRef(null);
    const textAnimationRef = useRef(null);
    const nav = useNavigate();
    const isCardsClickable = useRef(false);
    const [scrollY, setScrollY] = useState(0);

    const handleCardClick = (path) => {
        if (isCardsClickable.current) {
            nav(path);
        }
    };

    // 스크롤 위치 추적
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        if (window.innerWidth <= 1000) return;

        const smoothStep = (p) => p * p * (3 - 2 * p);

        // SVG 선 애니메이션
        const setupSvgAnimation = () => {
            if (!svgRef.current) return;

            const path = svgRef.current.querySelector('path');
            const length = path.getTotalLength();

            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
            });

            gsap.to(path, {
                strokeDashoffset: 0,
                scrollTrigger: {
                    trigger: '.main-card-con1',
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1,
                },
                duration: 2,
                ease: 'power2.inOut',
            });
        };

        setupSvgAnimation();

        // 첫 번째 섹션 스크롤 트리거
        ScrollTrigger.create({
            trigger: '.main-card-con1',
            start: 'top top',
            end: '75% top',
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const opacity = gsap.utils.interpolate(1, 0.5, smoothStep(progress));

                gsap.set('.main-card-con1-cards', { opacity });

                cardList.forEach((card, index) => {
                    const delay = index * 0.9;
                    const cardProgress = gsap.utils.clamp(
                        0,
                        1,
                        (progress - delay * 0.1) / (1 - delay * 0.1)
                    );

                    const y = gsap.utils.interpolate('0%', '350%', smoothStep(cardProgress));
                    const scale = gsap.utils.interpolate(1, 0.75, smoothStep(cardProgress));

                    let x = '0%';
                    let rotation = 0;

                    if (index === 0) {
                        x = gsap.utils.interpolate('0%', '90%', smoothStep(cardProgress));
                        rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress));
                    } else if (index === 2) {
                        x = gsap.utils.interpolate('0%', '-90%', smoothStep(cardProgress));
                        rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress));
                    }

                    gsap.set(`#${card.con1Id}`, { y, x, rotation, scale });
                });
            },
        });

        // con2 섹션에 들어가면 카드들을 숨김
        ScrollTrigger.create({
            trigger: '.main-card-con2',
            start: 'top bottom',
            end: 'bottom top',
            onEnter: () => {
                gsap.set('.main-card-cards', { opacity: 0, pointerEvents: 'none' });
            },
            onLeaveBack: () => {
                gsap.set('.main-card-cards', { opacity: 0, pointerEvents: 'none' });
            },
        });

        // 세 번째 섹션 스크롤 트리거
        const con3Trigger = ScrollTrigger.create({
            trigger: '.main-card-con3',
            start: 'top top',
            end: `+=${window.innerHeight * 4}px`,
            pin: true,
            pinSpacing: true,
            onEnter: () => {
                // 카드 클릭 가능하도록 설정
                isCardsClickable.current = true;
                gsap.set('.main-card-cards', {
                    opacity: 1,
                    pointerEvents: 'auto',
                });
            },
            onLeave: () => {
                const con3Section = document.querySelector('.main-card-con3');
                const con3Top = window.pageYOffset + con3Section.getBoundingClientRect().top;

                gsap.set('.main-card-cards', {
                    position: 'absolute',
                    top: con3Top,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    opacity: 0,
                    pointerEvents: 'none',
                });
            },
            onEnterBack: () => {
                // 다시 con3에 들어오면 클릭 활성화
                isCardsClickable.current = true;
                gsap.set('.main-card-cards', {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    opacity: 1,
                    pointerEvents: 'auto',
                });
            },
        });

        // 헤더와 카드 애니메이션
        ScrollTrigger.create({
            trigger: '.main-card-con3',
            start: 'top bottom',
            end: `+=${window.innerHeight * 4}`,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
                const headerY = gsap.utils.interpolate('400%', '0%', smoothStep(headerProgress));

                gsap.set('.main-card-con3-header', { y: headerY });

                cardList.forEach((card, index) => {
                    const delay = index * 0.5;
                    const cardProgress = gsap.utils.clamp(
                        0,
                        1,
                        (progress - delay * 0.1) / (0.9 - delay * 0.1)
                    );

                    const innerCard = document.querySelector(
                        `#${card.cardId} .main-card-flip-card-inner`
                    );

                    // Y값 계산
                    let y;
                    if (cardProgress < 0.4) {
                        y = gsap.utils.interpolate('-100%', '50%', smoothStep(cardProgress / 0.4));
                    } else if (cardProgress < 0.6) {
                        y = gsap.utils.interpolate(
                            '50%',
                            '0%',
                            smoothStep((cardProgress - 0.4) / 0.2)
                        );
                    } else {
                        y = '0%';
                    }

                    // Scale 계산
                    let scale;
                    if (cardProgress < 0.4) {
                        scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(cardProgress / 0.4));
                    } else if (cardProgress < 0.6) {
                        scale = gsap.utils.interpolate(
                            0.75,
                            1,
                            smoothStep((cardProgress - 0.4) / 0.2)
                        );
                    } else {
                        scale = 1;
                    }

                    // Opacity 계산
                    const opacity = cardProgress < 0.2 ? smoothStep(cardProgress / 0.2) : 1;

                    // X, 회전값 계산
                    let x, rotate, rotationY;
                    if (cardProgress < 0.6) {
                        x = index === 0 ? '100%' : index === 1 ? '0%' : '-100%';
                        rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
                        rotationY = 0;
                    } else if (cardProgress < 1) {
                        const normalizedProgress = (cardProgress - 0.6) / 0.4;
                        x = gsap.utils.interpolate(
                            index === 0 ? '100%' : index === 1 ? '0%' : '-100%',
                            '0%',
                            smoothStep(normalizedProgress)
                        );
                        rotate = gsap.utils.interpolate(
                            index === 0 ? -5 : index === 1 ? 0 : 5,
                            0,
                            smoothStep(normalizedProgress)
                        );
                        rotationY = smoothStep(normalizedProgress) * 180;
                    } else {
                        x = '0%';
                        rotate = 0;
                        rotationY = 180;
                    }

                    gsap.set(`#${card.cardId}`, { opacity, y, x, rotate, scale });
                    gsap.set(innerCard, { rotationY });
                });
            },
        });

        return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    }, []);

    // 카드 렌더링 함수
    const renderCards = (type) => {
        return cardList.map((card, index) => {
            const isCon1 = type === 'con1';
            const isMobile = type === 'mobile';
            const isMain = type === 'main';

            const id = isCon1 ? card.con1Id : isMobile ? card.mobileId : card.cardId;

            const refCallback = (el) => {
                if (isCon1) con1CardsRef.current[index] = el;
                else if (isMain) cardRefs.current[index] = el;
                else if (isMobile) mobileCardRefs.current[index] = el;
            };

            return (
                <div
                    key={card.id}
                    className={`main-card-card ${isMobile ? 'mobile-card' : ''}`}
                    id={id}
                    ref={refCallback}
                    onClick={() => handleCardClick(card.path)}
                    style={{ cursor: isMain ? 'pointer' : 'default' }}
                >
                    <div className="main-card-card-wrapper">
                        <div className="main-card-flip-card-inner">
                            <div className="main-card-flip-card-front">
                                <div className="main-card-card-title"></div>
                                <div className="main-card-card-title"></div>
                            </div>
                            <div className="main-card-flip-card-back">
                                <div className="main-card-card-title"></div>
                                <div
                                    className={`main-card-card-copy ${
                                        isMain || isMobile ? card.className : ''
                                    }`}
                                >
                                    <div className="pic">
                                        {/* <img src={card.img} alt={`Card ${card.id}`} /> */}
                                    </div>
                                </div>
                                <div className="main-card-card-title"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div ref={sectionRef} className="main-card">
            <nav className="main-card-nav">
                <div className="logo">
                    <span>Site Logo</span>
                </div>
                <div className="menu-btn">
                    <span>Menu</span>
                </div>
            </nav>

            <section className="main-card-con1">
                <div className="text-animation-container" ref={textAnimationRef}>
                    <div className="text-line hero-content-1">음악처럼, 배송도</div>
                    <div className="text-line hero-content-2">
                        <span className="highlight">타이밍이 중요</span>하니까
                    </div>
                </div>

                <div className="svg-animation-container">
                    <svg
                        ref={svgRef}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1920 592"
                        fill="none"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <path
                            d="M-22 63.6424C335.697 319.86 1137.27 748.741 1481.97 414.53C1912.85 -3.23469 1267.73 -177.832 1353.61 246.446C1422.32 585.869 1764.4 613.858 1950 578.248"
                            stroke="#6680FF"
                            strokeWidth="3"
                            fill="none"
                        />
                    </svg>
                </div>

                <div className="main-card-con1-cards">{renderCards('con1')}</div>
            </section>

            <section className="main-card-con2">
                <strong className="po">음악처럼, 배송도 타이밍이 중요하니까</strong>
                <h1 className="ho">PICK YOUR DAY</h1>
                <p className="co">내가 원하는 날, 맞춤 예약 배송</p>
                <div className="pic">
                    <img src="" alt="" />
                </div>
            </section>

            <section className="main-card-con3">
                <div className="main-card-con3-header" ref={con3HeaderRef}>
                    <h1 className="ti_1">PICK YOUR</h1>
                    <h2 className="ti_2">CARD</h2>
                </div>

                <div className="main-card-mobile-cards">
                    <div className="main-card-cards-container">{renderCards('mobile')}</div>
                </div>
            </section>

            <div className="main-card-cards" ref={cardsRef}>
                <div className="main-card-cards-container">{renderCards('main')}</div>
            </div>
        </div>
    );
};

export default MainCard;
