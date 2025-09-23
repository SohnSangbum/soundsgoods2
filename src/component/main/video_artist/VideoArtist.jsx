import { Link } from 'react-router-dom';
import MainAlbumList from './albumList/MainAlbumList';
import './style.scss';

import { useEffect, useState } from 'react';

import MainAlbumMobileList from './albumListMobile/MainAlbumMobileList';

const VideoArtist = () => {
    const today = new Date();
    const [width, setWidth] = useState(window.innerWidth);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 01~12
    const day = String(today.getDate()).padStart(2, '0'); // 01~31

    const formatted = `${year}-${month}-${day}`;
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <section id="video_artist">
            <div className="inner">
                <div className="title_box">
                    <span>Popular chart</span>
                    <h2>MUSIC Streaming</h2>
                </div>
                {width > 1024 ? <MainAlbumList /> : <MainAlbumMobileList />}
            </div>
        </section>
    );
};

export default VideoArtist;
