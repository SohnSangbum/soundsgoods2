import { useEffect, useState } from 'react';
import MagazinItem from './magazinItem/MagazinItem';
import MagazinTidins from './magazinTidings/MagazinTidins';
import './style.scss';
import { useNavigate } from 'react-router-dom';
const MagazineMain = () => {
    const navigate = useNavigate();
    const onGoMagazine = () => {
        navigate('/magazine');
    };
    const today = new Date();
    const [width, setWidth] = useState(window.innerWidth);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 01~12
    const day = String(today.getDate()).padStart(2, '0'); // 01~31

    const formatted = `${year}-${month}-${day}`;
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <section className="magazin_main">
            <div className="inner">
                {width > 1024 && <MagazinTidins />}
                {width < 1024 && <h2>지금 주목할 매거진 소식</h2>}
                <MagazinItem />
                {width < 1024 && (
                    <div className="mage_mobile">
                        <button>
                            <img src="/images/icons/white_next.png" alt="" />
                        </button>
                        <span onClick={onGoMagazine}>더 많은 매거진 알아보기</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MagazineMain;
