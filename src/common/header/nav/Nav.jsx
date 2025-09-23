import { useNavigate } from 'react-router-dom';
import NavList from './navList/NavList';
import './navStyle.scss';
import useUserStore from '../../../store/userSlice';
import useAuthStore from '../../../store/authSlice';

const Nav = ({ data, setShow, headerOn }) => {
    const { isLoggedIn } = useUserStore();
    const { authed } = useAuthStore();
    const navigate = useNavigate();

    const goMymusic = () => {
        navigate('mymusic');
    };
    const goAccess = () => {
        navigate('mymusic/Access');
    };

    return (
        <nav id="nav">
            <NavList data={data} setShow={setShow} headerOn={headerOn} />
            {authed ? <p onClick={goMymusic}>마이뮤직</p> : <p onClick={goAccess}>마이뮤직</p>}
        </nav>
    );
};

export default Nav;
