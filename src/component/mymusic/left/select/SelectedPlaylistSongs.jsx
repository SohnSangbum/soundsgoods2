import React, { useEffect, useState } from "react";
import "./style.scss";
import SelectedPlayItem from "./selectItem/SelectedPlayListItem";

const SelectedPlaylistSongs = ({ playlist, onDeselect }) => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    setSongs(playlist?.songs || []);
  }, [playlist]);

  const handleDelete = (id) => {
    setSongs((prev) => prev.filter((song) => song.id !== id));
  };

  if (!playlist) return null;

  return (
    <div className="selected_playlist_songs">
      <div className="playlist_header">
        <h3>플레이리스트 : {playlist.name}</h3>
        <button className="back_btn" onClick={onDeselect}>
          <h2> ← 전체 목록</h2>
        </button>
      </div>

      <div className="likemusic">
        <ul>
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <SelectedPlayItem key={song.id} song={song} />
            ))
          ) : (
            <div className="nonebox">
              <h2>저장된 음악이 없습니다.</h2>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SelectedPlaylistSongs;
