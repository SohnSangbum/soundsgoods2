import React from 'react';
import Mymusic_left_playlist_item from './Mymusic_left_playlist_item';
import SelectedPlaylistSongs from '../select/SelectedPlaylistSongs';

const Mymusic_left_playList2 = ({
    playlists,
    onSelectPlaylist,
    onDeletePlaylist,
    selectedPlaylist,
    onDeselectPlaylist,
}) => {
    // 선택된 플레이리스트가 있으면 상세보기
    if (selectedPlaylist) {
        return (
            <SelectedPlaylistSongs playlist={selectedPlaylist} onDeselect={onDeselectPlaylist} />
        );
    }

    return (
        <div className="left_playlistmusic2">
            {playlists.length === 0 && (
                <div className="nonebox">
                    <img src="/images/icons/wish_list.png" alt="" />
                    <h2>플레이리스트가 없습니다. 만들어보세요!</h2>
                </div>
            )}

            {playlists.map((playlist) => (
                <Mymusic_left_playlist_item
                    key={playlist.id}
                    playlist={playlist}
                    onClick={() => onSelectPlaylist(playlist)}
                    onDelete={() => onDeletePlaylist(playlist.id)}
                />
            ))}
        </div>
    );
};

export default Mymusic_left_playList2;
