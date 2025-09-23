import { useGoodsStore } from '../../store';
import CardLeft from './CardLeft';
import CardRight from './CardRight';
import './style.scss';
const CardDetailMain = ({ data }) => {
    return (
        <div className="card_detail_main">
            <CardRight data={data} />
            <CardLeft data={data} />
        </div>
    );
};

export default CardDetailMain;
