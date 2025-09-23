import PaymentCardMain from '../../component/paymentCard/PaymentCardMain';
import { useGoodsStore } from '../../store';
import './style.scss';

const PaymentCard = () => {
    const card = useGoodsStore((state) => state.card);
    const paymentCard = useGoodsStore((state) => state.paymentCard);

    return (
        <div id="payment_card">
            <div className="inner">
                <h2 className="title">주문 / 결제</h2>
                {paymentCard.length > 0 && <PaymentCardMain />}
            </div>
        </div>
    );
};

export default PaymentCard;
