import { NavLink, useNavigate } from 'react-router-dom';
import './style.scss';
import { useState } from 'react';
import Login from '../../../page/login';
import useUserStore from '../../../store/userSlice';

const StreamingMenu = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useUserStore();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const toggleLogin = () => setIsLoginOpen((prev) => !prev);
    const goMymusic = () => navigate('/mymusic');
    const goAccess = () => navigate('/mymusic/Access');

    return (
        <section id="streamingmenu">
            <div className="menu_inner">
                <ul className="menu_list">
                    <li>
                        <NavLink to="/streaming/" end>
                            스트리밍 홈
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/streaming/top100">
                            인기 차트 TOP 50
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/streaming/latestmusic">최신 음악</NavLink>
                    </li>
                    <li>
                        <NavLink to="/streaming/genre">장르별 음악</NavLink>
                    </li>
                    <li>
                        <NavLink to="/streaming/artist">
                            아티스트별 음악
                        </NavLink>
                    </li>
                </ul>

                <ul className="streamingmenu_btt">
                    {isLoggedIn ? (
                        <li onClick={goMymusic}>
                            <NavLink>마이뮤직</NavLink>
                        </li>
                    ) : (
                        <li onClick={goAccess}>
                            <NavLink>마이뮤직</NavLink>
                        </li>
                    )}

                    {!isLoggedIn ? (
                        <li className="btt_common" onClick={toggleLogin}>
                            <NavLink>로그인</NavLink>
                        </li>
                    ) : (
                        <li className="btt_common" onClick={logout}>
                            <NavLink>로그아웃</NavLink>
                        </li>
                    )}
                </ul>
            </div>
            {isLoginOpen && <Login onClose={toggleLogin} />}
        </section>
    );
};

export default StreamingMenu;
