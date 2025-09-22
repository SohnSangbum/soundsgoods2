import React from 'react';

const OrderStatusList = ({ statusCounts }) => {
    return (
        <section className="order-status">
            <h2>
                주문처리 현황 <span>(최근 3개월 기준)</span>
            </h2>
            <ul className="status-list">
                {statusCounts.map((status, idx) => (
                    <React.Fragment key={status.label}>
                        <li>
                            <strong>{status.count}</strong>
                            <p>{status.label}</p>
                        </li>
                        {idx < statusCounts.length - 1 && (
                            <li>
                                <span className="arrow">›</span>
                            </li>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </section>
    );
};

export default OrderStatusList;
