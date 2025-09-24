import { useNavigate } from 'react-router-dom';
import './style.scss';
const NoReservation = () => {
    const nav = useNavigate();
    return (
        <div className="no_reservation">
            <img src="/images/icons/reservation.jpg" alt="" />
            <strong>예약된 상품이 없습니다.</strong>
            <p onClick={() => nav(`/goods`)}>
                <button>굿즈 보러가기</button>
            </p>
        </div>
    );
};

export default NoReservation;
