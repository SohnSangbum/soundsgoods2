import { useEffect, useState } from 'react';
import ArtistIAlbum from './artistialbum/ArtistIAlbum';
import ArtistIGoods from './artistigoods/ArtistIGoods';
import ArtistIImg from './artistiimg/ArtistIImg';
import ArtistITop from './artistitop/ArtistITop';
import ArtistIVideo from './artistivideo/ArtistIVideo';
import './style.scss';
import ArtistIAlbumMobile from './artistialbummobile/ArtistIAlbumMobile';

const ArtistInfoWrap = ({ data }) => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <section id="artist-info-wrap">
            <div className="space">&nbsp;</div>
            <div>
                <div className="artist-info-img">
                    <ArtistIImg data={data} />
                </div>
                <div className="artist-info-con">
                    <ArtistITop data={data} />
                    {width > 1024 ? (
                        <ArtistIAlbum data={data} />
                    ) : (
                        <ArtistIAlbumMobile data={data} />
                    )}
                    <ArtistIVideo data={data} />
                    <ArtistIGoods data={data} />
                </div>
            </div>
        </section>
    );
};

export default ArtistInfoWrap;
