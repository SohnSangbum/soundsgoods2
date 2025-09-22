import { useEffect, useState } from 'react';
import ArtistCategory from './artistcategory/ArtistCategory';
import ArtistGoods from './artistgoods/ArtistGoods';
import RecArtist from './recartist/RecArtist';
import RecArtistMobile from './recartistmobile/RecArtistMobile';
import './style.scss';

const ArtistWrap = ({ data }) => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section id="artist-wrap">
            <div className="space">&nbsp;</div>
            <div className="inner">
                {width > 1024 ? <RecArtist data={data} /> : <RecArtistMobile data={data} />}
                <ArtistCategory />
                <ArtistGoods />
            </div>
        </section>
    );
};

export default ArtistWrap;
