import React from 'react';
import './style.scss';
import OrderStatusList from './oderChk/OrderStatusList';
import OrderList from './oderChk/Orderlist';

const Oderchk = () => {
    const statusCounts = [
        { label: '입금전', count: 0 },
        { label: '배송 준비중', count: 0 },
        { label: '배송중', count: 0 },
        { label: '배송완료', count: 2 },
    ];

    const orders = [
        {
            date: '2025.08.02',
            orderNum: '2024596854794',
            title: 'HUS(허밍어반스테레오) - MOOSA',
            status: '배송완료',
            price: '29,700',
        },
        // 다른 주문 데이터 추가 가능
    ];

    return (
        <div className="order-history">
            <OrderStatusList statusCounts={statusCounts} />
            <OrderList orders={orders} />
        </div>
    );
};

export default Oderchk;
