import { useState, useEffect } from 'react';
import LatestMusicList from './LatestMusicList';
import './style.scss';
import newData_51_100 from '../../../../assets/api/musicComponents/newData_51_100';
import { usemainAlbumStore } from '../../../../store';

const LatestMusicListWrap = () => {
    const [sortType, setSortType] = useState('정렬');
    const [sortedList, setSortedList] = useState([...(newData_51_100 || [])]);
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedAll, setSelectedAll] = useState(false);
    const { MStart, setPlaylist } = usemainAlbumStore();

    const handleSelectAll = () => {
        setSelectedAll((prev) => !prev);
    };

    const toggleSort = () => setSortOpen((prev) => !prev);

    useEffect(() => {
        let newList = [...newData_51_100];
        if (sortType === '최신순') {
            newList.sort((a, b) => new Date(b.release) - new Date(a.release));
        } else if (sortType === '인기순') {
            newList.sort(() => Math.random() - 0.5);
        } else if (sortType === '이름순') {
            newList.sort((a, b) => a.title.localeCompare(b.title));
        }
        setSortedList(newList);
    }, [sortType]);

    // 전체 재생 함수
    const handlePlayAll = () => {
        if (sortedList && sortedList.length > 0) {
            // 첫 번째 곡부터 재생 시작
            const firstTrack = sortedList[0];

            // 플레이리스트 설정 (정렬된 목록으로)
            setPlaylist(sortedList, firstTrack.id, 'latest');

            // 첫 번째 곡 재생
            MStart(firstTrack.id, 'latest');
        }
    };

    return (
        <section id="latest-music">
            <h2>최신 음악</h2>
            <div className="latest-music-top">
                <div className="latest-music-btn">
                    <button onClick={handleSelectAll}>
                        {selectedAll ? '전체 해제' : '전체 선택'}
                    </button>
                    <button onClick={handlePlayAll}>전체 재생</button>
                </div>
                <div className="latest-music-sort">
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
            <LatestMusicList data={sortedList} selectedAll={selectedAll} />
        </section>
    );
};

export default LatestMusicListWrap;
