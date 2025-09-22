import { Link } from 'react-router-dom';
import './style.scss';
import { IoMenuOutline } from 'react-icons/io5';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';

const HeaderM = () => {
    return (
        <header id="header">
            <p className="menu">
                <button>
                    <i>
                        <IoMenuOutline />
                    </i>
                </button>
            </p>
            <h2 className="logo">
                <Link>
                    <img src="/images/header/logo_type1.png" alt="" />
                </Link>
            </h2>
            <ul className="nav_list">
                <li>
                    <i>
                        <IoIosSearch />
                    </i>
                </li>
                <li>
                    <i>
                        <MdOutlineShoppingCart />
                    </i>
                </li>
            </ul>
        </header>
    );
};

export default HeaderM;
