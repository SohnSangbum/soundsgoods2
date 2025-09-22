import './style.scss';
import LatestMusicItem from './LatestMusicItem';
import usePaginationStore from '../../../../store/paginationSlice';
import Pagination from '../../pagination/Pagination';
import { useEffect } from 'react';
import useUserStore from '../../../../store/userSlice';
import { usePlaylistStore } from '../../../../store/albumSlice';
const LatestMusicList = ({ data, selectedAll }) => {
    const { setData, getCurrentPageData, currentPage, perPage } = usePaginationStore();
    const { isLoggedIn } = useUserStore();
    const playlists = usePlaylistStore((state) => state.playlists);
    useEffect(() => {
        setData(data); // 초기 데이터 세팅
    }, [setData, data]);

    const currentData = getCurrentPageData(); // slice 없이 바로 데이터 가져오기
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    return (
        <div>
            <table>
                <colgroup>
                    <col className="col-album" />
                    <col className="col-title" />
                    <col className="col-artist" />
                    <col className="col-time" />
                    <col className="col-release" />
                    <col className="col-play" />
                    <col className="col-like" />
                    <col className="col-fav" />
                </colgroup>
                <thead>
                    <tr>
                        <th></th>
                        <th>곡명</th>
                        <th>아티스트명</th>
                        <th>재생시간</th>
                        <th>발매일</th>
                        <th className="th-icon">재생</th>
                        <th className="th-icon">좋아요</th>
                        <th className="th-icon">찜하기</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) => (
                        <LatestMusicItem
                            key={item.id}
                            item={item}
                            isSelected={selectedAll}
                            playlists={isLoggedIn ? playlists : []}
                        />
                    ))}
                </tbody>
            </table>

            <Pagination />
        </div>
    );
};

export default LatestMusicList;
