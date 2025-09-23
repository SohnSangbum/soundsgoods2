import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './style.scss';
import MainAlbumMobileItem from './MainAlbumMobileItem';
import { usemainAlbumStore } from '../../../../store';
import 'swiper/css';
const MainAlbumMobileList = () => {
    const mainAlAtData = usemainAlbumStore((state) => state.mainAlAtData);
    const data = mainAlAtData.slice(0, 4);

    return (
        <div className="main_album_list">
            <Swiper className="mySwiper" slidesPerView={3}>
                {data.map((al) => (
                    <SwiperSlide key={al.id}>
                        <MainAlbumMobileItem al={al} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MainAlbumMobileList;
