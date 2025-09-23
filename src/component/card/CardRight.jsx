import './style.scss';
import { GoPlus } from 'react-icons/go';
import { LuMinus } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useGoodsStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CardRight = ({ data }) => {
    const { artist, title, price, release, cpn, quantity, id, totalPrice } = data;
    const { CardPush } = useGoodsStore();
    const nav = useNavigate();

    // 체크박스 상태 관리
    const [checkboxes, setCheckboxes] = useState({
        chk1: false,
        chk2: false,
        chk3: false,
        chk4: false,
    });

    // 전체 체크박스 상태 동기화
    useEffect(() => {
        const allChecked = checkboxes.chk1 && checkboxes.chk2 && checkboxes.chk3;
        setCheckboxes((prev) => ({
            ...prev,
            chk4: allChecked,
        }));
    }, [checkboxes.chk1, checkboxes.chk2, checkboxes.chk3]);

    // 개별 체크박스 핸들러
    const handleCheckboxChange = (name) => {
        setCheckboxes((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    // 전체 체크박스 핸들러
    const handleAllCheck = () => {
        const newValue = !checkboxes.chk4;
        setCheckboxes({
            chk1: newValue,
            chk2: newValue,
            chk3: newValue,
            chk4: newValue,
        });
    };

    const payNext = (x) => {
        if (!checkboxes.chk4) {
            toast('안내 사항을 모두 확인해주세요.');
            return;
        }
        CardPush(x);
        nav('/paymentCard');
    };

    return (
        <div className="card_right">
            <div className="cart_inner">
                <h2>{title}</h2>
                {/* title */}
                <div className="con con_1">
                    <ul className="artist_ganre">
                        <li>{artist}</li>
                        <li>댄스</li>
                    </ul>
                    <ul className="cpn_release">
                        <li>{cpn}</li>
                        <li>{release}</li>
                    </ul>
                </div>
                {/* div con con_1 */}
                <p className="price_cart">₩ {price.toLocaleString()}</p>
                {/* price_cart */}
                <div className="cart_form_chk">
                    <div className="form_con form_con1">
                        <input
                            type="checkbox"
                            name="chk1"
                            id="chk1"
                            checked={checkboxes.chk1}
                            onChange={() => handleCheckboxChange('chk1')}
                        />
                        <label htmlFor="chk1"></label>
                        <span>상세페이지 및 배송 일정 확인 후 구매 부탁드립니다</span>
                    </div>

                    <div className="form_con form_con2">
                        <input
                            type="checkbox"
                            name="chk2"
                            id="chk2"
                            checked={checkboxes.chk2}
                            onChange={() => handleCheckboxChange('chk2')}
                        />
                        <label htmlFor="chk2"></label>
                        <span>준비된 수량 소진 시 품절 될 수 있습니다.</span>
                    </div>
                    <div className="form_con form_con3">
                        <input
                            type="checkbox"
                            name="chk3"
                            id="chk3"
                            checked={checkboxes.chk3}
                            onChange={() => handleCheckboxChange('chk3')}
                        />
                        <label htmlFor="chk3"></label>
                        <span>해당 상품의 원활한 배송을 위하여 단독 구매 부탁드립니다.</span>
                    </div>
                    <div className="form_con form_con4 all_chk">
                        <input
                            type="checkbox"
                            name="chk4"
                            id="chk4"
                            checked={checkboxes.chk4}
                            onChange={handleAllCheck}
                        />
                        <label htmlFor="chk4"></label>
                        <span>안내 사항을 모두 확인했습니다</span>
                    </div>
                </div>

                {/* updown_btn */}
                <p className="total_price_detail">
                    <span>총 상품 금액</span>
                    <strong>₩ {totalPrice.toLocaleString()}</strong>
                </p>
                {/*total_price_detail */}
                <p className="total_price_detail_all">
                    <span>총 상품 금액</span>
                    <strong>₩ {totalPrice.toLocaleString()}</strong>
                </p>
                {/*total_price_detail_all */}
                <div className="pay_btns">
                    <button className="purchase" onClick={() => payNext(data)}>
                        <span>구매하기</span>
                    </button>
                </div>
            </div>
            {/* cart_inner */}
        </div>
    );
};

export default CardRight;
