import { useEffect, useState } from 'react';
import { useGoodsStore } from '../../store';
import CartList from './cartList/CartList';
import './style.scss';
import { useNavigate } from 'react-router-dom';
const ShoppingCart = () => {
    const [allChk, setAllChk] = useState(false);
    const { itemTotal, paymentTotal, cartItemCount, cart, toggleAllCheck, payPush2 } =
        useGoodsStore();
    const { updateTotals } = useGoodsStore();
    const nav = useNavigate();
    const handleAllCheck = () => {
        const chk = !allChk;
        setAllChk(chk);
        toggleAllCheck(chk);
    };
    useEffect(() => {
        updateTotals();
    }, [itemTotal, cart]);
    const payCom = (x) => {
        const checkedItems = cart.filter((item) => item.chk);
        if (checkedItems.length === 0) {
            alert('구매할 상품을 선택해주세요.');
            return;
        }
        payPush2(x);
        setTimeout(() => {
            nav('/pay');
        });
    };

    return (
        <div className="shopping_cart">
            <div className="shopping_item">
                <h3 className="all_select" onClick={handleAllCheck}>
                    <button>{allChk ? '전체 해제' : '전체 선택'}</button>
                </h3>
                {/* all_select */}
                <CartList />
                <p className="total_price">
                    <span>총 합계 금액</span>
                    <strong>₩ {itemTotal.toLocaleString()}</strong>
                </p>
            </div>
            {/* shopping_item */}
            <div className="total_price_box">
                <h3>TOTAL</h3>
                <ul className="price_cnt">
                    {cart.map((item) => (
                        <li>
                            <span>상품금액</span>
                            <p>+ {item.totalPrice} 원</p>
                        </li>
                    ))}

                    <li>
                        <span>배송비</span>
                        <p>+ 3,000원</p>
                    </li>
                    <li>
                        <span>할인 금액</span>
                        <p>- 1,000원</p>
                    </li>
                </ul>
                <p className="payment_price">
                    <span>총 결제 금액&nbsp;&nbsp;</span>
                    <strong>{paymentTotal.toLocaleString()}원</strong>
                </p>
                <p className="payment_btn" onClick={() => payCom(cart)}>
                    <button>구매하기</button>
                </p>
            </div>
            {/* total_price_box */}
        </div>
        // shopping_cart
    );
};

export default ShoppingCart;
