import React from 'react';
import './style.scss';
import Main_visual from '../../component/main/main_visual/Main_visual';
import VideoArtist from '../../component/main/video_artist/VideoArtist';
import IveSecret from '../../component/main/iveSecret/IveSecret';
import Goods from '../../component/main/goods/Goods';
import MagazineMain from '../../component/main/magazineMain/MagazineMain';
import ArtistsMain from '../../component/main/artistsMain/ArtistsMain';
import GoodsDetailMain from '../../component/main/goods/GoodsDetailMain/GoodsDetailMain';
import MainCard from '../../component/main/mainCard/MainCard';
const Main = () => {
    const top = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    return (
        <div id="main home">
            <Main_visual />
            <VideoArtist />
            <MainCard />
            <IveSecret />
            <ArtistsMain />
            <Goods />
            <GoodsDetailMain />
            <MagazineMain />
            <button className="top_btn_style" onClick={top}>
                <span>TOP</span>
            </button>
        </div>
    );
};

export default Main;
