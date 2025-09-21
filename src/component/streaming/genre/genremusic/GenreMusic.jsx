import { useEffect, useState } from 'react';
import GenreMusicList from './GenreMusicList';
import './style.scss';
import { usemainAlbumStore } from '../../../../store';

function parseRelease(str) {
    const [year, month] = str.split('-').map(Number);
    return new Date(year, month - 1, 1);
}

const GenreMusic = ({ data }) => {
    const [sortType, setSortType] = useState('정렬');
    const [sortedList, setSortedList] = useState([]);
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedAll, setSelectedAll] = useState(false);
    const { MStart, setPlaylist } = usemainAlbumStore();

    const handleSelectAll = () => {
        setSelectedAll((prev) => !prev);
    };

    const toggleSort = () => setSortOpen(!sortOpen);

    useEffect(() => {
        if (!data?.music) return;

        let newList = [...data.music];
        if (sortType === '최신순') {
            newList.sort((a, b) => parseRelease(b.release) - parseRelease(a.release));
        } else if (sortType === '인기순') {
            newList.sort(() => Math.random() - 0.5);
        } else if (sortType === '이름순') {
            newList.sort((a, b) => a.title.localeCompare(b.title));
        }
        setSortedList(newList);
    }, [sortType, data]);

    // 전체 재생 함수
    const handlePlayAll = () => {
        if (sortedList && sortedList.length > 0) {
            // 첫 번째 곡부터 재생 시작
            const firstTrack = sortedList[0];

            // 플레이리스트 설정 (정렬된 목록으로)
            setPlaylist(sortedList, firstTrack.id, 'genre');

            // 첫 번째 곡 재생
            MStart(firstTrack.id, 'genre');
        }
    };

    return (
        <section id="genre-music">
            <h2>{data.genre} 카테고리의 모든 음악</h2>
            <div className="genre-music-top">
                <div className="genre-music-btn">
                    <button onClick={handleSelectAll}>
                        {selectedAll ? '전체 해제' : '전체 선택'}
                    </button>
                    <button onClick={handlePlayAll}>전체 재생</button>
                </div>
                <div className="genre-music-sort">
                    {!sortOpen && (
                        <div className="sort-down" onClick={toggleSort}>
                            {sortType}
                        </div>
                    )}
                    <ul className={`sorting-list ${sortOpen ? 'on' : ''}`}>
                        <li className="sorting-title" onClick={() => setSortOpen(false)}>
                            정렬
                        </li>
                        {['최신순', '인기순', '이름순'].map((type) => (
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
            <GenreMusicList data={sortedList} selectedAll={selectedAll} />
        </section>
    );
};

export default GenreMusic;
