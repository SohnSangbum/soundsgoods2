import React from 'react';
import { GoPlus } from 'react-icons/go';
import { LuMinus } from 'react-icons/lu';
import { useGoodsStore } from '../../../../store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../store/authSlice';
const GoodsItem = ({ goods }) => {
    const {
        id,
        artist,
        title,
        category,
        price,
        release,
        cpn,
        imageM,
        imageS,
        remain,
        quantity,
        like,
        modal,
        chk,
        bookmark,
        count,
        totalPrice,
    } = goods;
    const { cartPush, downCountGoods, upCountGoods, payPush } = useGoodsStore();
    const { authed } = useAuthStore();
    const nav = useNavigate();
    const payadd = (x) => {
        if (authed) {
            payPush(x);
            setTimeout(() => {
                nav('/pay');
            }, 50);
        } else {
            toast('제품 구매를 위해 로그인이 필요합니다');
        }
    };
    const notify = (x) => {
        cartPush(x);
        toast('장바구니의 담기 성공');
    };
    const onNext = () => {
        nav(`/goods/${id}`);
    };
    return (
        <li className="goods_li">
            <div className="pic" onClick={onNext}>
                <img src={imageM} alt="" />
            </div>
            <div className="goods_text_box_li" onClick={onNext}>
                <h3>{title}</h3>
                <div className="con1">
                    <ul className="artist_ganre">
                        <li>{artist}</li>
                        <li>댄스</li>
                    </ul>
                    <ul className="com_release">
                        <li>{cpn}</li>
                        <li>{release}</li>
                    </ul>
                </div>
                <p className="price">₩ {price.toLocaleString()}</p>
                <div className="con2">
                    <ul className="count_text">
                        <li>남은수량</li>
                        <li>{remain}</li>
                    </ul>
                    <ul className="review_text">
                        <li>리뷰</li>
                        <li>2,562</li>
                    </ul>
                </div>
                <p className="limit_start">예약 판매 9/5 발송 예정</p>
            </div>
            <div className="quantity_count">
                <button className="down" onClick={() => downCountGoods(id)}>
                    <i>
                        <LuMinus />
                    </i>
                </button>
                <p className="quantity">{quantity}</p>
                <button className="up" onClick={() => upCountGoods(id)}>
                    <i>
                        <GoPlus />
                    </i>
                </button>
            </div>
            <div className="goods_btns">
                <div className="btn1" onClick={() => notify(goods)}>
                    <button>
                        <img src="images/icons/white_next.png" alt="" />
                    </button>
                    <span>카드에 넣기</span>
                </div>
                <div className="btn2" onClick={() => payadd(goods)}>
                    <button>
                        <img src="images/icons/white_next.png" alt="" />
                    </button>
                    <span>바로 구매하기</span>
                </div>
            </div>
        </li>
    );
};

export default GoodsItem;
