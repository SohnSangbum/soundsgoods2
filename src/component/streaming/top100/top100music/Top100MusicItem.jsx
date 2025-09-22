import { useEffect, useState } from 'react';
import './style.scss';
import { usemainAlbumStore } from '../../../../store';
import Likemodal from '../../../likemodal/Likemodal';
import { usePlaylistStore } from '../../../../store/albumSlice';
import useUserStore from '../../../../store/userSlice';

const Top100MusicItem = ({ item, rank, isSelected, playlists }) => {
    const [minute, setMinute] = useState(0);
    const [liked, setLiked] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const selectItem = usePlaylistStore((state) => state.selectItem);
    const addToMyMusicList = usePlaylistStore((state) => state.addToMyMusicList);
    const addSongToPlaylist = usePlaylistStore((state) => state.addSongToPlaylist);
    const addPlaylist = usePlaylistStore((state) => state.addPlaylist);
    const selectPlaylist = usePlaylistStore((state) => state.selectPlaylist);
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);

    const MStart = usemainAlbumStore((state) => state.MStart);

    useEffect(() => {
        setMinute(Math.floor(Math.random() * 60));
    }, []);

    return (
        <>
            <tr className={isSelected ? 'selected' : ''}>
                <td className="col-rank-td">{rank}</td>
                <td className="col-album-td">
                    <img src={item.image} alt="" />
                </td>
                <td className="col-title-td">
                    <strong>{item.title}</strong>
                    <p>{item.album}</p>
                </td>
                <td className="col-artist-td">
                    <p>{item.artist}</p>
                </td>
                <td className="col-time-td">3:{minute < 10 ? `0${minute}` : minute}</td>
                <td className="col-release-td">{item.release}</td>
                <td
                    className="col-play-td icon"
                    onClick={() => {
                        MStart(item.id, 'top');
                        addToMyMusicList(item);
                    }}
                >
                    <img src="/images/streaming/icon_play.png" alt="play" />
                </td>
                <td
                    className="col-like-td icon"
                    onClick={() => {
                        setLiked((prev) => !prev);
                        addSongToPlaylist(item.id, item);
                    }}
                >
                    <img
                        src={
                            liked
                                ? '/images/streaming/icon_heart_on.png'
                                : '/images/streaming/icon_heart.png'
                        }
                        alt="like"
                    />
                </td>
                <td
                    className="col-fav-td icon"
                    onClick={() => {
                        setDropdownOpen((prev) => !prev);
                        setFavorited((prev) => !prev);
                    }}
                >
                    <img
                        src={
                            favorited
                                ? '/images/streaming/icon_star_on.png'
                                : '/images/streaming/icon_star.png'
                        }
                        alt="favorite"
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

export default Top100MusicItem;
