import './style.scss';
import goodsData from '../../../assets/api/goods';
const GoodsMain = () => {
    const bannerData = goodsData.filter((item) => item.artist === 'IVE').slice(0, 2);
    return (
        <section className="goods_main">
            <h2 className="goods_page_main_title">굿즈</h2>
            <div className="goods_banner">
                <div className="banner_pic">
                    <img src="/images/goods/goods_banner1.png" alt="" />
                    <p>아이브(IVE) 4TH EP ALBUM</p>
                    <h3>[IVE SECRET] 발매 기념 팬사인회 이벤트 안내</h3>
                </div>
                <ul className="goods_list">
                    {bannerData.map((ive) => (
                        <li key={ive.id}>
                            <div className="li_pic">
                                <img src={ive.imageM} alt="" />
                            </div>
                            <strong>{ive.title}</strong>
                            <span>₩{ive.price.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default GoodsMain;
