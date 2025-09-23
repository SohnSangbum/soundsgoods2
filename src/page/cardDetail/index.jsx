import { useParams } from 'react-router-dom';
import './style.scss';
import CardDetailMain from '../../component/card/CardDetailMain';
import { useGoodsStore } from '../../store';
const CardDetail = () => {
    const { cardID } = useParams();
    const card = useGoodsStore((state) => state.card);
    const data = card.find((item) => item.id === Number(cardID));
    console.log(data);
    return (
        <div id="card_detail">
            <div className="inner">
                <CardDetailMain data={data} />
            </div>
        </div>
    );
};

export default CardDetail;
