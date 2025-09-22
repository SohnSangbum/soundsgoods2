import './style.scss';
import { useGoodsStore } from '../../store';
import ReservationItem from './ReservationItem';

const ReservationList = () => {
    const completeCard = useGoodsStore((state) => state.completeCard);
    return (
        <ul className="reservation_list">
            {completeCard.map((card, idx) => (
                <ReservationItem
                    key={idx}
                    item={card.items[0]}
                    form={card.formData}
                    orderDate={card.orderDate}
                />
            ))}
        </ul>
    );
};

export default ReservationList;
