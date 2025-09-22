import { useEffect, useState } from 'react';
import GenreArtist from './genreartist/GenreArtist';
import GenreArtistMobile from './genreartistmobile/GenreArtistMobile';
import GenreCategory from './genrecategory/GenreCategory';
import GenreCategoryMobile from './genrecategorymobile/GenreCategoryMobile';
import GenreImg from './genreimg/GenreImg';
import GenreMusic from './genremusic/GenreMusic';
import './style.scss';
const GenreWrap = ({ data, allGenres, onSelect }) => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section id="genre-wrap">
            <div className="space">&nbsp;</div>
            <div>
                <div className="genre-img">
                    <GenreImg data={data} />
                </div>
                <div className="genre_con">
                    {width > 1024 ? (
                        <GenreCategory
                            allGenres={allGenres}
                            selectedGenre={data}
                            onSelect={onSelect}
                        />
                    ) : (
                        <GenreCategoryMobile
                            allGenres={allGenres}
                            selectedGenre={data}
                            onSelect={onSelect}
                        />
                    )}
                    {width > 1024 ? <GenreArtist data={data} /> : <GenreArtistMobile data={data} />}
                    <GenreMusic data={data} />
                </div>
            </div>
        </section>
    );
};
export default GenreWrap;
