import { useState } from 'react';
import './style.scss';
import useArtistStore from '../../../../store/artistSlice';

const ArtistIImg = ({ data }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const followArtist = useArtistStore((state) => state.followArtist);
    const unfollowArtist = useArtistStore((state) => state.unfollowArtist);

    const FollowToggle = () => {
        setIsFollowing((prev) => !prev);
        if (!isFollowing) {
            followArtist(data); // 팔로우하면 store에 저장
        } else {
            unfollowArtist(data.id); // 팔로잉 취소 시 제거
        }
    };

    return (
        <section id="artist-i-img">
            <p>
                <img src={data.image} alt={data.artist} />
            </p>
            <div className="artist-info-title">
                <h2>{data.category}</h2>
                <h3>{data.artist}</h3>
                <div className="follow-btn">
                    <button className={isFollowing ? 'following' : ''} onClick={FollowToggle}>
                        {isFollowing ? '팔로잉' : '팔로우하기'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ArtistIImg;
