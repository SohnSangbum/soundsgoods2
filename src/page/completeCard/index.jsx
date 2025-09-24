import { useEffect, useState } from 'react';
import { useGoodsStore } from '../../store';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authSlice';

const CompleteCard = () => {
    const completeCard = useGoodsStore((state) => state.completeCard);
    const { authed, user } = useAuthStore();
    const [lastCom, setLastCom] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        if (completeCard.length > 0) {
            const latest = completeCard[completeCard.length - 1];
            setLastCom(latest);
        }
    }, [completeCard]);

    // 더 엄격한 조건 확인
    if (!lastCom || !lastCom.items || lastCom.items.length === 0) {
        return (
            <div id="complete">
                <div className="inner">
                    <h2>주문 정보를 불러오는 중...</h2>
                </div>
            </div>
        );
    }

    // 안전하게 데이터 추출
    const firstItem = lastCom.items[0] || {};
    const formData = lastCom.formData || {};
    const { recipient, phone, zipcode, address, detailAddress, memo } = formData;
    const { id, artist, bookmark, chk, price, totalPrice } = firstItem;

    return (
        <div id="complete">
            <div className="inner">
                <img src="/images/icons/check.png" alt="" />
                <h2 className="com_title">주문이 완료되었습니다</h2>
                <h3 className="com_number">
                    주문번호: <span> 2020090519683953</span>
                </h3>
                <div className="com_user">
                    <div className="del2 delivery_information">
                        <strong>배송 수령인 정보</strong>
                        <p className="cocon">
                            <span>{phone || '전화번호 정보 없음'}</span>
                            <span>{user?.name || '고객 정보 없음'}</span>
                        </p>
                    </div>
                    <div className="del del_memo">
                        <strong>배송메모</strong>
                        <p className="cocon">
                            <span>{memo || '배송메모 없음'}</span>
                        </p>
                    </div>
                    <div className="del del_memo">
                        <strong>배송비</strong>
                        <p className="cocon">
                            <span>3,000원</span>
                        </p>
                    </div>
                    <div className="del2 delivery_information">
                        <strong>입금 계좌 정보</strong>
                        <p className="cocon">
                            <span>은행명: 국민은행 035-12345678-456</span>
                            <span>예금주: 사운드굿즈(주)</span>
                            <span>{user?.name || '고객 정보 없음'}</span>
                        </p>
                    </div>
                    <div className="del del_memo">
                        <strong>입금금액</strong>
                        <p className="cocon">
                            {/* 가장 안전한 방법 */}
                            <span>{(price || 0 + 3000).toLocaleString()}원</span>
                        </p>
                    </div>
                </div>
                <div className="del_btns">
                    <p className="more" onClick={() => nav('/mymusic')}>
                        <button>주문 상세보기</button>
                    </p>
                    <p className="goods_next" onClick={() => nav('/goods')}>
                        <button>쇼핑 계속하기</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompleteCard;
