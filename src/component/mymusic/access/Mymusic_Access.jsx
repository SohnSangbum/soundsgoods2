import React, { useState, useEffect } from 'react';
import './style.scss';
import { FaChevronRight } from 'react-icons/fa';
import Login from '../../../page/login';
import { useNavigate } from 'react-router-dom';
import Join from '../../../page/join';
import useAuthStore from '../../../store/authSlice'; // 경로는 실제 위치에 맞게 수정해주세요

const Mymusic_Access = () => {
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);

    const { authed, user, login, logout, signup, kakaoLogin, initialize } = useAuthStore();

    // 컴포넌트 마운트 시 스토어 초기화
    useEffect(() => {
        initialize();
    }, [initialize]);

    const toggleLogin = () => setIsLoginOpen((prev) => !prev);
    const toggleJoin = () => setIsJoinOpen((prev) => !prev);

    const handleLogin = () => {
        toggleLogin();
        navigate('/');
    };

    const handleJoin = () => {
        toggleJoin();
        navigate('/');
    };

    return (
        <div className="inner">
            <div className="access">
                <img src="/images/icons/Login_Acess.png" alt="" />
            </div>
            <div className="text">
                <p>
                    로그인하고 나만의 <span>할인 이용권</span>을 확인해 보세요!
                    <br /> 카카오톡으로 할인혜택을 받아보세요.
                </p>
            </div>
            <div className="login-button">
                <button onClick={toggleLogin}>
                    <FaChevronRight />
                    로그인하기
                </button>
                <button onClick={toggleJoin}>
                    <FaChevronRight />
                    회원가입
                </button>
            </div>

            {/* Login 컴포넌트에 스토어 함수 전달 */}
            {isLoginOpen && (
                <Login
                    onClose={handleLogin}
                    onLogin={login}
                    onKakaoLogin={kakaoLogin}
                    authed={authed}
                    user={user}
                />
            )}

            {/* Join 컴포넌트에 스토어 함수 전달 */}
            {isJoinOpen && <Join onClose={handleJoin} onSignup={signup} />}
        </div>
    );
};

export default Mymusic_Access;
