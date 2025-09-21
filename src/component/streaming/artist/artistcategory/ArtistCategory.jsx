import { useEffect, useState } from 'react';
import ArtistCategoryItem from './ArtistCategoryItem';
import './style.scss';
import artist_info from '../../../../assets/api/artist_info';

const ArtistCategory = () => {
    const [artist] = useState(artist_info);
    const [sortType, setSortType] = useState('정렬');
    const [sortedList, setSortedList] = useState([]);
    const [sortOpen, setSortOpen] = useState(false);
    const toggleSort = () => setSortOpen((prev) => !prev);

    useEffect(() => {
        let newList = [...artist];
        if (sortType === '인기순') {
            newList.sort((a, b) => a.id - b.id);
        } else if (sortType === '이름순') {
            newList.sort((a, b) => a.artist.localeCompare(b.artist));
        }
        setSortedList(newList);
    }, [sortType, artist]);

    return (
        <section id="artist-category">
            <div className="artist-category-top">
                <h2>이 달의 아티스트</h2>
                <div className="artist-sort">
                    {!sortOpen && (
                        <div className="sort-down" onClick={toggleSort}>
                            {sortType}
                        </div>
                    )}
                    <ul className={`sorting-list ${sortOpen ? 'on' : ''}`}>
                        <li className="sorting-title" onClick={toggleSort}>
                            정렬
                        </li>
                        {['이름순', '인기순'].map((type) => (
                            <li
                                key={type}
                                className={sortType === type ? 'on' : ''}
                                onClick={() => {
                                    setSortType(type);
                                    setSortOpen(false);
                                }}
                            >
                                {type}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="artist-category-list">
                {sortedList.slice(0, 15).map((item) => (
                    <ArtistCategoryItem key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
};

export default ArtistCategory;
