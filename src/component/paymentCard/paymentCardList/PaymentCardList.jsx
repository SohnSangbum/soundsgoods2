import React from 'react';
import PaymentCardItem from './PaymentCardItem';
import './style.scss';
import { useGoodsStore } from '../../../store';
const PaymentCardList = () => {
    const paymentCard = useGoodsStore((state) => state.paymentCard);
    return (
        <ul className="payment_card_list">
            {paymentCard.map((item) => (
                <PaymentCardItem item={item} />
            ))}
        </ul>
    );
};

export default PaymentCardList;
