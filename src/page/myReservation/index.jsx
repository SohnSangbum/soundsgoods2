import './style.scss';
import { useGoodsStore } from '../../store';
import ReservationList from '../../component/ReservationList/ReservationList';

const MyReservation = () => {
    const completeCard = useGoodsStore((state) => state.completeCard);
    return (
        <div id="my_reservation">
            <div className="inner">
                <h2>내 예약</h2>
                {completeCard.length > 0 && <ReservationList />}
            </div>
        </div>
    );
};

export default MyReservation;
