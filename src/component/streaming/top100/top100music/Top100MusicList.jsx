import './style.scss';
import Top100MusicItem from './Top100MusicItem';
import usePaginationStore from '../../../../store/paginationSlice';
import Pagination from '../../pagination/Pagination';
import { useEffect } from 'react';
import { usePlaylistStore } from '../../../../store/albumSlice';
import useUserStore from '../../../../store/userSlice';

const Top100MusicList = ({ data, selectedAll }) => {
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

    // const currentData = getCurrentPageData(); // slice 없이 바로 데이터 가져오기

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, [currentPage]);

    return (
        <>
            <table>
                <colgroup>
                    <col className="col-rank" />
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
                        <th>순위</th>
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
                        <Top100MusicItem
                            playlists={isLoggedIn ? playlists : []}
                            key={item.id}
                            item={item}
                            rank={(currentPage - 1) * perPage + index + 1}
                            isSelected={selectedAll}
                        />
                    ))}
                </tbody>
            </table>
            <Pagination />
        </>
    );
};
export default Top100MusicList;
