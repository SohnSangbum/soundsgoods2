import { useNavigate } from 'react-router-dom';
import './style.scss';
import { useGoodsStore } from '../../../../store';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const ArtistIGoodsItem = ({ item }) => {
    const navigate = useNavigate();
    const { goodsMain, isLikeWithWish } = useGoodsStore();
    const [currentItem, setCurrentItem] = useState(
        goodsMain.find((g) => g.id === item.id) || item
    );
    useEffect(() => {
        const updated = goodsMain.find((g) => g.id === item.id);
        if (updated) setCurrentItem(updated);
    }, [goodsMain, item.id]);
    const formattedPrice = currentItem?.price
        ? currentItem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : null;
    const onClick = () => {
        navigate(`/goods/${currentItem?.id || '#'}`);
    };
    const onWishClick = (e) => {
        e.stopPropagation();
        const likeState = !currentItem?.like;
        toast(likeState ? '위시리스트 추가' : '위시리스트 삭제');
        isLikeWithWish(currentItem.id);
        setCurrentItem((prev) => ({
            ...prev,
            like: likeState,
            count: likeState
                ? (prev.count || 0) + 1
                : Math.max(0, (prev.count || 0) - 1),
        }));
    };

    return (
        <div className="artist-i-goods-item" onClick={onClick}>
            <div className="artist-i-goods-img">
                <img
                    src={
                        currentItem?.imageM ||
                        '/images/streaming/goods_placeholder.png'
                    }
                    alt={currentItem?.title || '상품 이미지 없음'}
                />
                <p className="wish-box" onClick={onWishClick}>
                    <span className="icon">
                        <img
                            src={
                                currentItem?.like
                                    ? '/images/streaming/goods_heart_on.png'
                                    : '/images/streaming/goods_heart.png'
                            }
                            alt={currentItem?.like ? '좋아요' : '좋아요 해제'}
                        />
                    </span>
                    <span className="count">{currentItem?.count || 0}</span>
                </p>
            </div>
            <div className="artist-i-goods-text">
                <h3>{currentItem?.title || '상품 정보 없음'}</h3>
                <h4>₩ {formattedPrice || '가격 정보 없음'}</h4>
            </div>
        </div>
    );
};

export default ArtistIGoodsItem;
