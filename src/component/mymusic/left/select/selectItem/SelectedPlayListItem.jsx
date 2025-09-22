import React from 'react';
import './style.scss';
import { AiOutlineClose } from 'react-icons/ai';
const SelectedPlayItem = ({ song }) => {
    return (
        <li className="song_item">
            <div className="song_img_wrapper">
                <img src={song.image} alt={song.title} className="song_img" />
                <AiOutlineClose className="delete_btn" />
            </div>

            <div className="song_info">
                <div className="info_head">
                    <strong className="song_title">{song.title}</strong>
                </div>
                <p className="song_artist">{song.artist}</p>
                <p className="song_album">{song.album}</p>
                <span className="song_release">{song.release}</span>
            </div>
        </li>
    );
};

export default SelectedPlayItem;
