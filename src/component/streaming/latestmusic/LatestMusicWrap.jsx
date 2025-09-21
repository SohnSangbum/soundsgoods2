import { useEffect, useRef } from 'react';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './style.scss';
import LatestMusicListWrap from './latestmusiclistwrap/LatestMusicListWrap';

const LatestMusicWrap = () => {
    const swiperRef = useRef(null);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const videos = [
        {
            id: 'CgCVZdcKcqY',
            artist: 'JUMP',
            title: 'BLACKPINK',
            date: '2025. 9. 2',
        },
        {
            id: '23sM_7PtNvY',
            artist: 'Ryudejakeiru',
            title: 'Silica Gel',
            date: '2023. 12. 27',
        },
        {
            id: 's4Ow55AbdCg',
            artist: 'ETA',
            title: 'NewJeans',
            date: '2023. 7. 25',
        },
        {
            id: 'V9PVRfjEBTI',
            artist: 'BIRDS OF A FEATHER',
            title: 'Billie Eilish',
            date: '2024. 9. 28',
        },
        {
            id: 'yebNIHKAC4A',
            artist: 'Golden',
            title: 'KPop Demon Hunters',
            date: '2025. 6. 24',
        },
        {
            id: 'tzL4A8hyXc8',
            artist: 'A Long Dream',
            title: 'SE SO NEON',
            date: '2017. 6. 20',
        },
    ];

    return (
        <section id="latest-wrap">
            <div className="visual-area">
                <div className="btn-wrap">
                    <i
                        className="swiper-no-swiping"
                        onClick={() => {
                            const swiper = swiperRef.current;
                            if (!swiper) return;

                            if (swiper.activeIndex === 0) {
                                // 맨 앞에서 왼쪽 누르면 → 맨 끝으로
                                swiper.slideTo(swiper.slides.length - 1);
                            } else {
                                swiper.slidePrev();
                            }
                        }}
                    >
                        <SlArrowLeft />
                    </i>

                    <i
                        className="swiper-no-swiping"
                        onClick={() => {
                            const swiper = swiperRef.current;
                            if (!swiper) return;

                            if (swiper.activeIndex === swiper.slides.length - 1) {
                                // 맨 끝에서 오른쪽 누르면 → 맨 앞으로
                                swiper.slideTo(0);
                            } else {
                                swiper.slideNext();
                            }
                        }}
                    >
                        <SlArrowRight />
                    </i>
                </div>
            </div>
            <Swiper
                slidesPerView={1}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
            >
                {videos.map((v) => (
                    <SwiperSlide key={v.id}>
                        <div className="video-visual">
                            <div className="bg-opacity"></div>
                            <iframe
                                src={`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${v.id}`}
                                title={v.title}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            ></iframe>
                            <ul className="video-text">
                                <li>{v.artist}</li>
                                <li>{v.title}</li>
                                <li>발매일: {v.date}</li>
                            </ul>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <LatestMusicListWrap />
        </section>
    );
};

export default LatestMusicWrap;
