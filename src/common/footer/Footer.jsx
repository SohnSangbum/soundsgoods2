import './style.scss';
const Footer = () => {
    return (
        <footer id="footer">
            <div className="inner">
                <h2>
                    <img src="/images/header/logo_type2.png" alt="" />
                </h2>
                <ul className="sns_icons">
                    <li>
                        <img src="/images/footer/Frame_536.png" alt="" />
                    </li>
                    <li>
                        <img src="/images/footer/Frame_537.png" alt="" />
                    </li>
                    <li>
                        <img src="/images/footer/Frame_538.png" alt="" />
                    </li>
                    <li>
                        <img src="/images/footer/Frame_539.png" alt="" />
                    </li>
                    <li>
                        <img src="/images/footer/Frame_540.png" alt="" />
                    </li>
                </ul>
                <ul className="footer_con con1">
                    <li>이용약관</li>
                    <li>개인정보처리방침</li>
                    <li>제휴 프로모션문의</li>
                    <li>이메일 주소 무단 수집 거부</li>
                </ul>
                <ul className="footer_con con2">
                    <li>
                        (주) SoundsGoods | 서울특별시 서초구 서초대로77길 41 디디2빌딩 9층, 10층
                    </li>
                    <li> 대표이사 : 송태민</li>
                    <li>사업자 등록번호 : 220-88-02594</li>
                    <li>통신판매업신고번호 : 2018-성남분당B-0004</li>
                </ul>
                <ul className="footer_con con3">
                    <li>문의전화 : 1566-7727 (평일 09:00-18:00, 유료)</li>
                </ul>
                <p className="con4">Copyright © 2025 SoundsGoods</p>
            </div>
        </footer>
    );
};

export default Footer;
