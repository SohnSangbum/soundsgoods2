import { usemainAlbumStore } from '../../../../store';
import MainAlbumItem from './MainAlbumItem';
import './style.scss';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
const MainAlbumList = () => {
    const mainArtistData = usemainAlbumStore((state) => state.mainArtistData);
    const data = mainArtistData.slice(0, 8);
    return (
        <div className="main_album_list">
            <Swiper className="mySwiper" slidesPerView={4} spaceBetween={20}>
                {data.map((al) => (
                    <SwiperSlide key={al.id}>
                        <MainAlbumItem al={al} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MainAlbumList;
