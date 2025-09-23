import Review from '../goodsDetail/detailMain/review/Review';
import './style.scss';
const CardLeft = ({ data }) => {
    const { img, title, backImg } = data;
    return (
        <div className="card_left">
            <div className="detail_pic_1">
                <div className="pic">
                    <img src={img} alt="" />
                </div>
                <div className="pic2">
                    <img src={backImg} alt="" />
                </div>
            </div>
            {/* detail_pic_1 */}

            {/* detail_pic_1 */}
            <div className="delivery_text">
                <p className="text_box1">
                    <span>배송안내</span>
                    <img src="/images/icons/black_top.png" alt="" />
                </p>
                <ul className="delivery_list">
                    <li>배송비: 3,000원 (도서·산간 추가비 발생)</li>
                    <li>기간: 영업일 기준 2~7일</li>
                    <li>예약상품: 출시일 이후 순차 배송 (최대 7일+ 소요 가능)</li>
                </ul>
            </div>
            {/* delivery_text*/}
            <div className="pay_guide_text">
                <p className="text_box1">
                    <span>결제수단 안내</span>
                    <img src="/images/icons/black_top.png" alt="" />
                </p>
                <ul className="pay_guide_list">
                    <li>결제수단: 신용카드, 실시간 계좌이체, 가상계좌, 카카오페이</li>
                    <li>환불: 결제한 수단으로만 가능 </li>
                    <li>주문 완료된 건은 결제수단 변경 불가</li>
                    <li>가상계좌 입금 기한: 주문 당일 23:59:59 이후 자동취소</li>
                </ul>
            </div>
            {/* pay_guide_text */}
            <div className="change_text">
                <p className="text_box1">
                    <span>교환 반품 안내</span>
                    <img src="/images/icons/black_top.png" alt="" />
                </p>
                <ul className="change_list">
                    <li>단순 변심: 상품 수령 후 7일 이내 신청</li>
                    <li>상품 하자·오배송: 수령 후 90일 이내 신청</li>
                    <li>
                        불가 사유:
                        <ul>
                            <li>수령 후 7일 초과</li>
                            <li>포장/구성품 훼손, 세탁, 사용 흔적</li>
                            <li>주문제작/세일상품/음반 등 환불불가 표시된 상품</li>
                        </ul>
                    </li>
                    <li>
                        비용:
                        <ul>
                            <li>단순 변심 → 구매자 부담 / 하자·오배송 → 판매자 부담</li>
                        </ul>
                    </li>
                </ul>
            </div>
            {/* change_text */}
            <div className="goods_status_text">
                <p className="text_box1">
                    <span>상품 정보</span>
                    <img src="/images/icons/black_top.png" alt="" />
                </p>
                <ul className="goods_status_list">
                    <li>발매일 2025년 09월</li>
                </ul>
            </div>
            {/* goods_status_text */}
            <Review title={title} />
        </div>
    );
};

export default CardLeft;
