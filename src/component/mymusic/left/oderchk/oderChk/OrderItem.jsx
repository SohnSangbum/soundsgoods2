import React from 'react';
import './style.scss';

const OrderItem = ({ date, orderNum, title, status, price }) => {
    return (
        <div className="order-item">
            <div className="order-info-top">
                <span className="date">{date}</span>
                <span className="order-num">주문번호 {orderNum}</span>
                <button className="detail-btn">상세 보기</button>
            </div>
            <div className="order-info-main">
                <div className="thumb">
                    <img src="/images/streaming/hm.jpg" alt="hus" />
                </div>
                <div className="order-desc">
                    <p className="title">{title}</p>
                    <p className="status">
                        배송현황 <span>{status}</span>
                    </p>
                </div>
                <div className="order-price">
                    <span>₩ {price}</span>
                    <button className="delete-btn">×</button>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
