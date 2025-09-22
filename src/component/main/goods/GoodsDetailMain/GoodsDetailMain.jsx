import React, { useState } from 'react';
import './style.scss';
import GoodsFilter from '../../../goods/goodsFilter/goodsFilter/GoodsFilter';
import LimitedGoodsList from '../../../goods/imitGoods/limitGoodsList/LimitedGoodsList';
import { useNavigate } from 'react-router-dom';

const GoodsDetailMain = () => {
    const navigate = useNavigate();
    const onGo = () => {
        navigate('/goods');
    };
    const [width, setWidth] = useState(window.innerWidth);
    return (
        <section className="goods_product_filter">
            <div className="goods_titles">
                <div className="title">
                    <span className="goods_title_m">Music goods</span>
                    <h2 className="goods_title_N">NEW GOODS</h2>
                </div>
                <GoodsFilter />
            </div>
            <div className="limit_goods">
                <LimitedGoodsList />

                {width > 1024 && (
                    <div className="more_main_artist">
                        <button>
                            <img src="/images/icons/white_next.png" alt="" />
                        </button>
                        <span className="more_goods" onClick={onGo}>
                            더 굿즈 찾아보기
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GoodsDetailMain;
