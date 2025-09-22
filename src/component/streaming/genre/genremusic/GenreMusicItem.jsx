import { useEffect, useState } from 'react';
import { usemainAlbumStore } from '../../../../store';
import './style.scss';
import { usePlaylistStore } from '../../../../store/albumSlice';
import useUserStore from '../../../../store/userSlice';
import Likemodal from '../../../likemodal/Likemodal';

const GenreMusicItem = ({ item, isSelected, playlists }) => {
    const [minute, setMinute] = useState(0);
    const [like, setLike] = useState(false);
    const [fav, setFav] = useState(false);
    const addSongToPlaylist = usePlaylistStore((state) => state.addSongToPlaylist);
    const addToMyMusicList = usePlaylistStore((state) => state.addToMyMusicList);
    const addPlaylist = usePlaylistStore((state) => state.addPlaylist);
    const selectPlaylist = usePlaylistStore((state) => state.selectPlaylist);
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const MStart = usemainAlbumStore((state) => state.MStart); // ✅ MStart 가져오기
    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        const randomMinute = Math.floor(Math.random() * 60);
        setMinute(randomMinute);
    }, []);

    return (
        <>
            <tr className={isSelected ? 'selected' : ''}>
                <td className="col-album-td">
                    <img src={item.image} alt="" />
                </td>
                <td className="col-title-td">
                    <strong>{item.title}</strong>
                    <p>{isMobile ? item.artist : item.album}</p>
                </td>{' '}
                <td className="col-artist-td">
                    <p>{item.artist}</p>
                </td>
                <td className="col-time-td">3:{minute < 10 ? `0${minute}` : minute}</td>
                <td className="col-release-td">{item.release}</td>
                <td
                    className="col-play-td icon"
                    onClick={() => {
                        MStart(item.id, 'genre');
                        addToMyMusicList(item);
                    }}
                >
                    <img src="/images/streaming/icon_play.png" alt="" />
                </td>
                <td className="col-like-td icon">
                    <img
                        src={
                            like
                                ? '/images/streaming/icon_heart_on.png'
                                : '/images/streaming/icon_heart.png'
                        }
                        alt="좋아요"
                        onClick={() => setLike(!like)}
                    />
                </td>
                <td className="col-fav-td icon">
                    <img
                        src={
                            fav
                                ? '/images/streaming/icon_star_on.png'
                                : '/images/streaming/icon_star.png'
                        }
                        alt="찜하기"
                        onClick={() => {
                            setFav(!fav);
                            setDropdownOpen((prev) => !prev);
                        }}
                    />
                </td>
            </tr>

            {dropdownOpen && (
                <tr className="dropdown-row">
                    <td colSpan={9}>
                        <Likemodal
                            playlists={isLoggedIn ? playlists : []}
                            onSelect={(pl) => {
                                selectPlaylist(pl);
                                addSongToPlaylist(pl.id, item);
                                setDropdownOpen(false);
                            }}
                            onAddPlaylist={(name) => addPlaylist(name)}
                            onConfirm={() => setDropdownOpen(false)}
                        />
                    </td>
                </tr>
            )}
        </>
    );
};

export default GenreMusicItem;
