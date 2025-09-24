import React, { useEffect, useState } from 'react';
import './style.scss';
import IveList from './leftIveList/IveList';
import ivedata from '../../../assets/api/iveData';
import { useNavigate } from 'react-router-dom';
const IveSecret = () => {
    const navigate = useNavigate();
    const onGoMusic = () => {
        navigate('/streaming/artistinfo/12');
    };
    const [data, setData] = useState(ivedata);
    const [musicVedio, setMusicVedio] = useState(ivedata[0]);
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
        <section className="ive_secret">
            {width < 1024 && (
                <h2 className="ive_title_mobile">
                    NEW <br />
                    IVE SECRET
                </h2>
            )}

            <div className="ive_content">
                {width > 1024 && (
                    <div className="left_ive_secret">
                        <div className="left_ive_text">
                            <strong>Music Vedio</strong>
                            <h2>
                                NEW <br />
                                IVE SECRET
                            </h2>

                            {width > 1024 && (
                                <div className="more_main_musicV">
                                    <button>
                                        <img src="/images/icons/white_next.png" alt="" />
                                    </button>
                                    <span className="more_music-vedio" onClick={onGoMusic}>
                                        신곡 더 보러가기
                                    </span>
                                </div>
                            )}
                            <div className="leftImg">
                                <p className="leftImg1">
                                    <img
                                        src="/images/main/main_con5_1.jpg"
                                        alt=""
                                        style={{ width: 570 }}
                                    />
                                </p>
                                <p className="leftImg2">
                                    <img
                                        src="/images/main/main_con5_2.jpg"
                                        alt=""
                                        style={{ width: 280 }}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="music_video_right">
                    <iframe
                        src="https://www.youtube.com/embed/B1ShLiq3EVc"
                        className="muvi"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default IveSecret;
