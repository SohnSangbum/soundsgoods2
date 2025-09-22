import React from 'react';
import { useParams } from 'react-router-dom';
import { useGoodsStore } from '../../store';
import './style.scss';
import GoodsCart from '../../component/goodsDetail/goodsCart/GoodsCart';
import DetailMain from '../../component/goodsDetail/detailMain/DetailMain';
const GoodsDetail = () => {
    const { goodsID } = useParams();
    const goods = useGoodsStore((state) => state.goods);
    const data = goods.find((item) => item.id === Number(goodsID));

    return (
        <div id="goods_detail">
            <div className="inner">
                <DetailMain data={data} />
                <GoodsCart data={data} />
            </div>
        </div>
    );
};

export default GoodsDetail;
