import './style.scss';
import GenreMusicItem from './GenreMusicItem';
import usePaginationStore from '../../../../store/paginationSlice';
import Pagination from '../../pagination/Pagination';
import { useEffect } from 'react';
import useUserStore from '../../../../store/userSlice';
import { usePlaylistStore } from '../../../../store/albumSlice';

const GenreMusicList = ({ data, selectedAll }) => {
    const { setData, getCurrentPageData } = usePaginationStore();
    const { isLoggedIn } = useUserStore();
    const playlists = usePlaylistStore((state) => state.playlists);
    useEffect(() => {
        setData(data); // 초기 데이터 세팅
    }, [setData, data]);

    useEffect(() => {
        if (data) {
            setData(data);
        }
    }, [data, setData]);

    const currentData = getCurrentPageData();
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
                        <th>곡명 / 앨범명</th>
                        <th>아티스트명</th>
                        <th>재생시간</th>
                        <th>발매일</th>
                        <th className="th-icon">재생</th>
                        <th className="th-icon">좋아요</th>
                        <th className="th-icon">찜하기</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item) => (
                        <GenreMusicItem
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

export default GenreMusicList;
