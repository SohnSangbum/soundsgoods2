import { usePlaylistStore } from '../../../store/albumSlice';
import Mymusic_right_Item from './Mymusic_right_Item';

const Mymusic_right_List = () => {
    const myMusicList = usePlaylistStore((state) => state.myMusicList) || [];
    const removeSong = usePlaylistStore((state) => state.removeSong);

    return (
        <div className="Mymusic_right_List">
            {myMusicList.map((song) => (
                <Mymusic_right_Item key={song.id} song={song} onDelete={removeSong} />
            ))}
        </div>
    );
};

export default Mymusic_right_List;
