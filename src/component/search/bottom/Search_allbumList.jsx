import React from 'react';
import Search_allbumItem from './Search_allbumItem';
import '../bottom/style.scss';
const Search_allbumList = ({ data }) => {
    return (
        <div className="allbumList">
            <div className="allbumTitle">
                <h2>앨범 검색결과</h2>
                <h3>더보기</h3>
            </div>
            <div className="allbum">
                {data
                    .flatMap((artist) => artist.album || [])
                    .map((album) => (
                        <Search_allbumItem key={album.id} item={album} />
                    ))}
            </div>
        </div>
    );
};

export default Search_allbumList;
