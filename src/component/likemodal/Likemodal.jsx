import React, { useRef, useEffect, useState } from 'react';
import { usePlaylistStore } from '../../store/albumSlice';
import './style.scss';
import { IoCloseOutline } from 'react-icons/io5';

const Likemodal = ({ onSelect, onAddPlaylist, onConfirm }) => {
    const playlists = usePlaylistStore((state) => state.playlists);

    const [isOpen, setIsOpen] = useState(true);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
                onConfirm();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onConfirm]);

    const handleAdd = () => {
        const name = prompt('새 플레이리스트 이름을 입력하세요');
        if (name) onAddPlaylist(name);
    };

    return (
        isOpen && (
            <div className="likemodal" ref={menuRef}>
                <ul>
                    {playlists.length > 0 ? (
                        playlists.map((pl) => (
                            <li
                                key={pl.id}
                                onClick={() => {
                                    onSelect(pl);
                                }}
                            >
                                {pl.name}
                            </li>
                        ))
                    ) : (
                        <li>플레이리스트가 없습니다.</li>
                    )}
                </ul>
                <button onClick={handleAdd}>+ 새 플레이리스트</button>
                <button
                    className="close"
                    onClick={() => {
                        setIsOpen(false);
                        onConfirm();
                    }}
                >
                    <IoCloseOutline />
                </button>
            </div>
        )
    );
};

export default Likemodal;
