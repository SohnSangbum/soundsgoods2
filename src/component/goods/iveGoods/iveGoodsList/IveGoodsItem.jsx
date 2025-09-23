import React from 'react';
import { useNavigate } from 'react-router-dom';

const IveGoodsItem = ({ title, imageM, price, id }) => {
    const nav = useNavigate();
    return (
        <li onClick={() => nav(`/goods/${id}`)}>
            <div className="ive_pic">
                <img src={imageM} alt="" />
            </div>
            <p>
                <strong>{title}</strong>
                <span>₩{price.toLocaleString()}</span>
            </p>
        </li>
    );
};

export default IveGoodsItem;
