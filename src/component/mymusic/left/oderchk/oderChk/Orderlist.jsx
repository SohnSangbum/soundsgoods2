import React from 'react';
import OrderItem from './OrderItem';

const OrderList = ({ orders }) => {
    return (
        <section className="order-list">
            <h2>주문내역 조회</h2>
            {orders.map((order) => (
                <OrderItem
                    key={order.orderNum}
                    date={order.date}
                    orderNum={order.orderNum}
                    title={order.title}
                    status={order.status}
                    price={order.price}
                />
            ))}
        </section>
    );
};

export default OrderList;
