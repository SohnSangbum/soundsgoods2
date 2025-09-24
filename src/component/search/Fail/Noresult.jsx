import { useEffect, useState } from 'react';
import artist_info from '../../../assets/api/artist_info';
import RecArtist from '../../streaming/artist/recartist/RecArtist';
import './style.scss';

const Noresult = ({ text }) => {
    return (
        <div className="inner">
            <div className="searchaccess">
                <img src="/images/streaming/searchFail.png" alt="" />
            </div>
            <div className="text">
                <p>
                    검색어 <span>{text}</span>에 해당하는 결과가 없습니다. <br /> 다른 키워드로
                    검색해보세요.
                    <br />
                    <strong>대신 이런 아티스트는 어때요 ?</strong>
                </p>
            </div>
            <RecArtist data={artist_info} />
        </div>
    );
};

export default Noresult;
