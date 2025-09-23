import { useState } from 'react';
import useAuthStore from '../../../store/authSlice';
import './style.scss';
import { IoClose } from 'react-icons/io5';

const LoginModal = ({ onClose, onJoin }) => {
    const login = useAuthStore((state) => state.login);
    const kakaoLogin = useAuthStore((state) => state.kakaoLogin);
    const loading = useAuthStore((state) => state.loading);

    const [loginForm, setLoginForm] = useState({ loginEmail: '', loginPW: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        if (loading) return;

        // loginId 필드로 검색하도록 수정
        const result = await login({
            loginId: loginForm.loginEmail, // userid → loginId로 변경
            password: loginForm.loginPW,
        });

        if (result.success) {
            alert(`${result.user.name}님, 오신 걸 환영합니다.`);
            onClose();
        } else {
            alert(result.error || '로그인 정보를 확인해주세요.');
        }
    };

    const handleKakaoLogin = async () => {
        if (loading) return;

        try {
            // 카카오 SDK가 있는지 확인
            if (window.Kakao && window.Kakao.Auth) {
                window.Kakao.Auth.login({
                    success: async (authObj) => {
                        window.Kakao.API.request({
                            url: '/v2/user/me',
                            success: async (userInfo) => {
                                const kakaoUserData = {
                                    id: userInfo.id,
                                    email: userInfo.kakao_account.email || '',
                                    nickname: userInfo.properties.nickname || '',
                                };

                                const result = await kakaoLogin(kakaoUserData);
                                if (result.success) {
                                    alert(`${result.user.name}님, 오신 걸 환영합니다.`);
                                    onClose();
                                } else {
                                    alert('카카오 로그인에 실패했습니다.');
                                }
                            },
                            fail: (error) => {
                                console.error('카카오 사용자 정보 조회 실패:', error);
                                alert('카카오 로그인에 실패했습니다.');
                            },
                        });
                    },
                    fail: (error) => {
                        console.error('카카오 로그인 실패:', error);
                        alert('카카오 로그인에 실패했습니다.');
                    },
                });
            } else {
                // 카카오 SDK가 없을 경우 테스트용
                alert('카카오 SDK가 로드되지 않았습니다. 테스트 모드로 진행합니다.');
                const kakaoUserData = {
                    id: 'kakao_test_' + Date.now(),
                    email: 'kakao@example.com',
                    nickname: '카카오테스트사용자',
                };

                const result = await kakaoLogin(kakaoUserData);
                if (result.success) {
                    alert(`${result.user.name}님, 카카오 로그인 성공!`);
                    onClose();
                } else {
                    alert('카카오 로그인에 실패했습니다.');
                }
            }
        } catch (error) {
            console.error('카카오 로그인 에러:', error);
            alert('카카오 로그인 처리 중 오류가 발생했습니다.');
        }
    };

    const onHandleClick = () => {
        onJoin();
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login">
            <p className="close">
                <IoClose onClick={onClose} />
            </p>
            <h1>로그인</h1>

            <div className="loginInput">
                <p>
                    <input
                        type="text"
                        name="loginEmail"
                        placeholder="아이디"
                        value={loginForm.loginEmail}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                </p>

                <p>
                    <input
                        type="password"
                        name="loginPW"
                        placeholder="비밀번호"
                        value={loginForm.loginPW}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                </p>
            </div>

            <div className="btn1">
                <button className="on" type="button" onClick={handleLogin} disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </div>

            <ul>
                <li>아이디 찾기</li>
                <li>비밀번호 찾기</li>
                <li onClick={onHandleClick}>회원가입</li>
            </ul>

            <div className="snslogin">
                <p onClick={handleKakaoLogin} style={{ cursor: 'pointer' }} title="카카오 로그인">
                    <img src="/images/icons/login03.png" alt="kakaologin" />
                    <span>카카오로 로그인 하기</span>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
