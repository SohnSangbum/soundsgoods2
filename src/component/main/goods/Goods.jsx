import React, { useEffect, useState, useRef } from 'react';
import './style.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const Goods = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const sliderRef = useRef(null);
    const sliderWrapperRef = useRef(null);
    const slidesRef = useRef([]);
    const animationRef = useRef(null);
    const sidebarRef = useRef(null);
    const mainGoodsRef = useRef(null);
    const targetRef = useRef(0);
    const currentRef = useRef(0);
    const ease = 0.075;
    const slideImages = [
        '/images/main/maingoods/main_goods01.jpg',
        '/images/main/maingoods/main_goods03.jpg',
        '/images/main/maingoods/main_goods04.jpg',
        '/images/main/maingoods/main_goods05.jpg',
        '/images/main/maingoods/main_goods06.jpg',
        '/images/main/maingoods/main_goods07.jpg',
        '/images/main/maingoods/main_goods08.jpg',
        '/images/main/maingoods/main_goods09.jpg',
        '/images/main/maingoods/main_goods10.jpg',
        '/images/main/maingoods/main_goods11.jpg',
        '/images/main/maingoods/main_goods12.jpg',
        '/images/main/maingoods/main_goods13.jpg',
    ];
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const updateScaleAndPosition = () => {
        slidesRef.current.forEach((slide) => {
            if (!slide) return;
            const rect = slide.getBoundingClientRect();
            const centerPosition = (rect.left + rect.right) / 2;
            const distanceFromCenter = centerPosition - window.innerWidth / 2;
            let scale, offsetX;
            if (distanceFromCenter > 0) {
                scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
                offsetX = (scale - 1) * 300;
            } else {
                scale = Math.max(0.5, 1 - Math.abs(distanceFromCenter) / window.innerWidth);
                offsetX = 0;
            }
            if (window.gsap) {
                window.gsap.set(slide, { scale, x: offsetX });
            } else {
                slide.style.transform = `scale(${scale}) translateX(${offsetX}px)`;
            }
        });
    };
    const update = () => {
        currentRef.current = lerp(currentRef.current, targetRef.current, ease);
        if (sliderWrapperRef.current) {
            if (window.gsap) {
                window.gsap.set(sliderWrapperRef.current, {
                    x: -currentRef.current,
                });
            } else {
                sliderWrapperRef.current.style.transform = `translateX(-${currentRef.current}px)`;
            }
        }
        updateScaleAndPosition();
        animationRef.current = requestAnimationFrame(update);
    };
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            if (sliderWrapperRef.current) {
                const maxScroll = sliderWrapperRef.current.offsetWidth - window.innerWidth;
                targetRef.current = Math.min(targetRef.current, maxScroll);
            }
        };
        const handleWheel = (e) => {
            if (sliderWrapperRef.current) {
                const maxScroll = sliderWrapperRef.current.offsetWidth - window.innerWidth;
                targetRef.current += e.deltaY;
                targetRef.current = Math.max(0, targetRef.current);
                targetRef.current = Math.min(maxScroll, targetRef.current);
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('wheel', handleWheel);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);
    useEffect(() => {
        update();
        // main-goods를 기준으로 GSAP ScrollTrigger 핀 고정
        if (mainGoodsRef.current && sliderWrapperRef.current) {
            // 전체 스크롤 거리 계산
            const totalScrollDistance = sliderWrapperRef.current.offsetWidth - window.innerWidth;
            ScrollTrigger.create({
                trigger: mainGoodsRef.current,
                start: 'top 25%',
                end: `+=${totalScrollDistance * 0.5}`, // 슬라이더가 끝날 때까지
                pin: true, // main-goods 전체를 핀 고정
                pinSpacing: true,
                markers: true,
            });
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, [width]); // width 의존성 추가로 리사이즈시 재계산
    return (
        <div className="main-goods" ref={mainGoodsRef}>
            <div className="sidebar" ref={sidebarRef}>
                <div className="sidebar-item">
                    <p className="main-pop">
                        Kategorie <br /> collection
                    </p>
                    <p className="bg-artists_goods">Artists goods</p>
                </div>
            </div>
            <div className="sliders" ref={sliderRef}>
                <div className="slider-wrapper" ref={sliderWrapperRef}>
                    {slideImages.map((imageSrc, index) => (
                        <div
                            key={index}
                            className="slide"
                            ref={(el) => (slidesRef.current[index] = el)}
                        >
                            <img src={imageSrc} alt={`Slide ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Goods;
