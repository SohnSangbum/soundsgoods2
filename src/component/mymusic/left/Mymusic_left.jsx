import React from 'react';
import './style.scss';
import Mymusic_left_profile from './profile/Mymusic_left_profile';
import Mymusic_left_playlist from './playlist/Mymusic_left_playlist';
import Recommendplay from './recommendplaylist/Recommendplay';
import Mymusic_promotion from './promotion/Mymusic_promotion';
import Oderchk from './oderchk/Oderchk';

const Mymusic_left = () => {
    return (
        <div className="Mymusic_left">
            <Mymusic_left_profile />
            <Oderchk />
            <Mymusic_left_playlist />
            <Recommendplay />
            <Mymusic_promotion />
        </div>
    );
};

export default Mymusic_left;
