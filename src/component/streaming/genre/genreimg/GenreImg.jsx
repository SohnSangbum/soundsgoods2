import { useParams } from 'react-router-dom';
import './style.scss';
const GenreImg = ({ data }) => {
    const { title } = useParams();
    const isDefault = !title;
    const imgSrc = title ? data?.genreimg : '/images/streaming/genre_visual.png';
    const genreText = title ? data?.genre : '다양한 장르의 음악을 만나보세요.';
    return (
        <section id="genre-img" className={isDefault ? 'default-text' : ''}>
            <p>
                <img src={imgSrc} alt="" />
            </p>
            <h2>{genreText}</h2>
        </section>
    );
};
export default GenreImg;
