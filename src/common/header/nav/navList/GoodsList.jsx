import React from 'react';
import './Goodsstyle.scss';
import GoodsItem from './GoodsItem';
import { FaAngleRight } from 'react-icons/fa6';

const GoodsList = ({ data }) => {
    return (
        <div className="GoodsList">
            <div className="goods_item">
                <div className="left">
                    <img src="/images/header/header_visual.jpg" alt="" />
                    <div className="goods_text">
                        <h2>
                            [ Dirty Work ] OFFICIAL MD <br />
                            PRE-ORDER OPEN ~9.3 (WED) 23:59
                        </h2>
                    </div>
                </div>
                <div className="rightbox">
                    <div className="right-text">
                        <h2>
                            폭 넓어진<span>Sounds</span> 더 좋아진 <span>Goods</span>
                        </h2>
                        <FaAngleRight />
                    </div>
                    <div className="right">
                        {data.onContent &&
                            data.onContent.map((item) => <GoodsItem key={item.id} data={item} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoodsList;
