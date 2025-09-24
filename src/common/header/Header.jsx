import React, { useRef, useState } from 'react';
import './style.scss';

import Nav from './nav/Nav';
import { Link, useNavigate } from 'react-router-dom';
import headerData from '../../assets/api/headerData';
import HeaderForm from './headerForm/HeaderForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Login from '../../page/login';
import Join from '../../page/join';
import GoodsList from './nav/navList/GoodsList';
import useAuthStore from '../../store/authSlice';

const Header = () => {
    const { authed, user, logout } = useAuthStore();
    const [show, setShow] = useState(false);
    const [data, setData] = useState(headerData);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const toggleLogin = () => setIsLoginOpen((prev) => !prev);
    const toggleJoin = () => setIsJoinOpen((prev) => !prev);
    const swiperRef = useRef();
    const nav = useNavigate();

    const onHome = () => {
        nav('/');
    };

    // 디버깅용으로 현재 데이터 상태 출력
    console.log('현재 데이터:', data);

    const headerOn = (hoveredId) => {
        setData((prevData) => {
            const newData = prevData.map((item) => {
                if (item.id === hoveredId) {
                    return item.onContent ? { ...item, isOn: true } : item;
                } else {
                    return item.onContent && item.isOn ? { ...item, isOn: false } : item;
                }
            });
            const shouldShow = newData.some((item) => item.onContent && item.isOn);
            setShow(shouldShow);

            return newData;
        });
    };
    return (
        <header id="header" className={show ? 'active' : ''} onMouseLeave={() => setShow(false)}>
            <div className="header_top_menu">
                <ul>
                    {!authed ? (
                        <>
                            <li onClick={toggleLogin}>로그인</li>
                            <li onClick={toggleJoin}>회원가입</li>
                        </>
                    ) : (
                        <>
                            <li>{user?.name}님</li>
                            <li onClick={logout}>로그아웃</li>
                            <li onClick={() => nav('/cart')}>장바구니</li>
                            <li onClick={() => nav('/myReservation')}>내 예약</li>
                        </>
                    )}
                </ul>
            </div>

            <div className="inner">
                <h1 className="logo" onClick={onHome}>
                    <Link to="/">
                        <img src="/images/header/logo_type1.png" alt="" />
                    </Link>
                </h1>
                <HeaderForm />
                <Nav data={data} setShow={setShow} headerOn={headerOn} />
            </div>

            {/* id 2번: 굿즈 사전 예약 */}
            {data.find((item) => item.id === 2)?.isOn && (
                <div className="header_content2">
                    <div className="headergoods">
                        <GoodsList data={data.find((item) => item.id === 2)} />
                    </div>
                </div>
            )}

            {/* id 3번: 팝업 스토어 */}
            {data.find((item) => item.id === 3)?.isOn && (
                <div className="header_content">
                    <h2>
                        <strong>sounds goods</strong>
                        <p>pop-up store</p>
                    </h2>
                    <button className="swiper_next" onClick={() => swiperRef.current?.slideNext()}>
                        <img src="/images/icons/icon-park-outline_right.png" alt="" />
                    </button>
                    <button className="swiper_prev" onClick={() => swiperRef.current?.slidePrev()}>
                        <img src="/images/icons/icon-park-outline_left.png" alt="" />
                    </button>
                    <Swiper
                        navigation={true}
                        modules={[Navigation]}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        className="mySwiper"
                        slidesPerView={3}
                        spaceBetween={50}
                        slidesPerGroup={3}
                    >
                        {data
                            .find((item) => item.id === 3)
                            ?.onContent?.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <div className="swiper_content">
                                        <img src={item.img} alt="" />
                                        <p>{item.title}</p>
                                        <span>{item.desc}</span>
                                        <div className="bg"></div>
                                    </div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            )}

            {isLoginOpen && <Login onClose={toggleLogin} onJoin={toggleJoin} />}
            {isJoinOpen && <Join onClose={toggleJoin} />}
        </header>
    );
};

export default Header;
