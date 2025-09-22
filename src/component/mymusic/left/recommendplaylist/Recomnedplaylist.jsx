import React from 'react';
import RecommendListItem from './RecommendListItem';
import useArtistStore from '../../../../store/artistSlice';

const Recomnedplaylist = () => {
    const follow = useArtistStore((state) => state.followedArtists);

    return (
        <div className="Recomnedplaylist1">
            {follow.map((artist) => (
                <RecommendListItem key={artist.id} artist={artist} />
            ))}
        </div>
    );
};

export default Recomnedplaylist;
