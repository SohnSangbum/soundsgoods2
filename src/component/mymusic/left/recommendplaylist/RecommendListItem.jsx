import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecommendListItem = ({ artist }) => {
    const navigate = useNavigate();
    const goInfo = () => {
        navigate(`/streaming/artistinfo/${artist.id}`);
    };
    return (
        <div className="recomendlistItem">
            <div className="recomendlistimg" onClick={goInfo}>
                <img src={artist.imageS} alt="" />{' '}
                <div className="artistTitle">
                    <h2>{artist.artist}</h2>
                </div>
            </div>
        </div>
    );
};

export default RecommendListItem;
