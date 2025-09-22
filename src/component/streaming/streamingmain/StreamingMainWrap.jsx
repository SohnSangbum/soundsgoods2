import { useEffect } from 'react';
import Con1Latest from './Con1Latest';
import Con2Top100 from './Con2Top100';
import Con3Artist from './Con3Artist';
import Con4Genre from './Con4Genre';
import Con5Newmv from './Con5Newmv';
import './style.scss';

const StreamingMainWrap = ({ data, allGenres, onSelect }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <section id="streaming-wrap">
            <div className="space">&nbsp;</div>
            <div className="streaming-main-con">
                <div className="video-visual">
                    <div className="bg-opacity"></div>
                    <iframe
                        src="https://www.youtube.com/embed/ekr2nIex040?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=ekr2nIex040"
                        title="dd"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    ></iframe>
                    <div className="video-text">
                        MUSIC<span>Streaming</span>
                    </div>
                </div>

                <Con1Latest />
                <Con2Top100 />
                <Con3Artist />
                <Con4Genre data={data} allGenres={allGenres} onSelect={onSelect} />
                <Con5Newmv />
            </div>
        </section>
    );
};

export default StreamingMainWrap;
