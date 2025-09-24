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
    const { authed, user, logout } = useAuthStore(); // userStore 제거하고 authStore만 사용
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
    const headerOn = (x) => {
        setData(
            data.map((item) => {
                if (item.id === x) {
                    // 호버한 항목이 isOn을 가지고 있으면 true로 설정
                    if (item.isOn !== undefined) {
                        return { ...item, isOn: true };
                    }
                    // isOn이 없는 항목이면 아무 변화 없이 리턴
                    return item;
                } else {
                    // 다른 항목들: isOn이 있고 현재 true인 항목만 false로 설정
                    // (isOn이 없는 항목은 건드리지 않음)
                    if (item.isOn !== undefined && item.isOn === true) {
                        return { ...item, isOn: false };
                    }
                    return item;
                }
            })
        );
    };
    // 디버깅을 위한 콘솔 로그
    console.log('authed 상태:', authed);
    console.log('user 정보:', user);

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
            {data[2].isOn && (
                <div className="header_content">
                    <h2>
                        <strong>sounds goods</strong>
                        <p>pop-up store</p>
                    </h2>
                    <button className="swiper_next" onClick={() => swiperRef.current.slideNext()}>
                        <img src="/images/icons/icon-park-outline_right.png" alt="" />
                    </button>
                    <button className="swiper_prev" onClick={() => swiperRef.current.slidePrev()}>
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
                        {data[2].onContent.map((item) => (
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
            {/* ////////////////////////////////////////////////// */}
            {data[1].isOn && (
                <div className="header_content2">
                    <div className="headergoods">
                        <GoodsList data={data[1]} />
                    </div>
                </div>
            )}

            {isLoginOpen && <Login onClose={toggleLogin} onJoin={toggleJoin} />}
            {isJoinOpen && <Join onClose={toggleJoin} />}
        </header>
    );
};

export default Header;
