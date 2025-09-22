import React, { useState } from 'react';
import Mymusic_left_playList2 from './Mymusic_left_playList2';
import { usePlaylistStore } from '../../../../store/albumSlice';

const Mymusic_left_playlist = () => {
    const playlists = usePlaylistStore((state) => state.playlists);
    const selectedPlaylist = usePlaylistStore((state) => state.selectedPlaylist);
    const addPlaylist = usePlaylistStore((state) => state.addPlaylist);
    const selectPlaylist = usePlaylistStore((state) => state.selectPlaylist);
    const deselectPlaylist = usePlaylistStore((state) => state.deselectPlaylist);
    const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);

    const [newPlaylistName, setNewPlaylistName] = useState('');

    const MAX_PLAYLISTS = 6;

    const handleAddPlaylist = () => {
        if (!newPlaylistName.trim()) return;

        if (playlists.length >= MAX_PLAYLISTS) {
            alert(`플레이리스트는 최대 ${MAX_PLAYLISTS}개까지 생성할 수 있습니다.`);
            return;
        }

        addPlaylist(newPlaylistName);
        setNewPlaylistName('');
    };

    return (
        <div className="Mymusic_left_playlist">
            <div className="left_playlist">
                <div className="left_playlisttitle">
                    <h2>저장한 플레이리스트</h2>
                    <div className="add_playlist">
                        <input
                            type="text"
                            placeholder="플레이리스트 이름을 입력하세요"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                        />
                        <button onClick={handleAddPlaylist}>+</button>
                    </div>
                </div>

                <Mymusic_left_playList2
                    playlists={playlists}
                    selectedPlaylist={selectedPlaylist}
                    onSelectPlaylist={selectPlaylist}
                    onDeselectPlaylist={deselectPlaylist}
                    onDeletePlaylist={deletePlaylist}
                />
            </div>
        </div>
    );
};

export default Mymusic_left_playlist;
