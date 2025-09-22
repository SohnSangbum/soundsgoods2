import React from 'react';
import './style.scss';

const Oderchk = () => {
    return (
        <div className="order-history">
            {/* 주문처리 현황 */}
            <section className="order-status">
                <h2>
                    주문처리 현황 <span>(최근 3개월 기준)</span>
                </h2>
                <ul className="status-list">
                    <li>
                        <strong>0</strong>
                        <p>입금전</p>
                    </li>
                    <li>
                        <span className="arrow">›</span>
                    </li>
                    <li>
                        <strong>0</strong>
                        <p>배송 준비중</p>
                    </li>
                    <li>
                        <span className="arrow">›</span>
                    </li>
                    <li>
                        <strong>0</strong>
                        <p>배송중</p>
                    </li>
                    <li>
                        <span className="arrow">›</span>
                    </li>
                    <li>
                        <strong>2</strong>
                        <p>배송완료</p>
                    </li>
                </ul>
            </section>

            {/* 주문내역 조회 */}
            <section className="order-list">
                <h2>주문내역 조회</h2>
                <div className="order-item">
                    <div className="order-info-top">
                        <span className="date">2025.08.02</span>
                        <span className="order-num">주문번호 2024596854794</span>
                        <button className="detail-btn">상세 보기</button>
                    </div>
                    <div className="order-info-main">
                        <div className="thumb"></div>
                        <div className="order-desc">
                            <p className="title">HUS(허밍어반스테레오) - MOOSA</p>
                            <p className="status">
                                배송현황 <span>배송완료</span>
                            </p>
                        </div>
                        <div className="order-price">
                            <span>₩ 29,700</span>
                            <button className="delete-btn">×</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Oderchk;
