import './style.scss';
import { GoPlus } from 'react-icons/go';
import { LuMinus } from 'react-icons/lu';
import { useGoodsStore } from '../../../store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authSlice';
const GoodsCart = ({ data }) => {
    const { artist, title, price, release, cpn, quantity, id, totalPrice } = data;
    const { upCountGoods, downCountGoods, cartPush, wishPush, payPush } = useGoodsStore();
    const { authed } = useAuthStore();
    const nav = useNavigate();
    const addCart = (x) => {
        cartPush(x);
        toast('장바구니 담기 성공');
    };
    const addWish = (x) => {
        wishPush(x);
        toast('관심상품 등록');
    };
    const next = (x) => {
        if (authed) {
            payPush(x);
            setTimeout(() => {
                nav('/pay');
            });
        } else {
            Swal.fire({
                title: '정말 예약을 취소하겠습니까?',

                showCancelButton: true,

                confirmButtonText: '예약취소',
                cancelButtonText: '×',
                customClass: {
                    popup: 'custom-swal-popup',
                    cancelButton: 'cancel-btn-with-icon',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                }
            });
        }
    };
    return (
        <div className="goods_cart">
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
                        <input type="checkbox" name="chk1" id="chk1" />
                        <label htmlFor="chk1"></label>
                        <span>상세페이지 및 배송 일정 확인 후 구매 부탁드립니다</span>
                    </div>

                    <div className="form_con form_con2">
                        <input type="checkbox" name="chk2" id="chk2" />
                        <label htmlFor="chk2"></label>
                        <span>준비된 수량 소진 시 품절 될 수 있습니다.</span>
                    </div>
                    <div className="form_con form_con3">
                        <input type="checkbox" name="chk3" id="chk3" />
                        <label htmlFor="chk3" for="chk3"></label>
                        <span>해당 상품의 원활한 배송을 위하여 단독 구매 부탁드립니다.</span>
                    </div>
                    <div className="form_con form_con4 all_chk">
                        <input type="checkbox" name="chk4" id="chk4" />
                        <label htmlFor="chk4"></label>
                        <span>안내 사항을 모두 확인했습니다</span>
                    </div>
                </div>
                <div className="updown_price">
                    <strong className="updown_title">{title}</strong>
                    <div className="updown_btn">
                        <button className="down btn" onClick={() => downCountGoods(id)}>
                            <i>
                                <LuMinus />
                            </i>
                        </button>
                        <span>{quantity}</span>
                        <button className="up btn" onClick={() => upCountGoods(id)}>
                            <i>
                                <GoPlus />
                            </i>
                        </button>
                        <p>₩ {price.toLocaleString()}</p>
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
                    <button className="purchase" onClick={() => next(data)}>
                        <span>구매하기</span>
                    </button>
                    <div className="wish_list">
                        <button className="btn0 cart_next" onClick={() => addCart(data)}>
                            <span>장바구니 담기</span>
                        </button>
                        <button className="btn0 wish_next" onClick={() => addWish(data)}>
                            <span>관심 상품 담기 </span>
                        </button>
                    </div>
                </div>
            </div>
            {/* cart_inner */}
        </div>
    );
};

export default GoodsCart;
