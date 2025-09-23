import { usemainAlbumStore } from '../../../../store';
import MainAlbumItem from './MainAlbumItem';
import './style.scss';

const MainAlbumList = () => {
    const mainArtistData = usemainAlbumStore((state) => state.mainArtistData);
    const data = mainArtistData.slice(0, 4);
    return (
        <ul className="main_album_list">
            {data.map((al) => (
                <MainAlbumItem key={al.id} al={al} />
            ))}
        </ul>
    );
};

export default MainAlbumList;
