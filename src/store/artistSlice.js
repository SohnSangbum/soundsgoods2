import { create } from 'zustand';

const useArtistStore = create((set) => ({
    followedArtists: [],

    followArtist: (artist) =>
        set((state) => {
            const exists = state.followedArtists.some((a) => a.id === artist.id);
            if (exists) return state; // 이미 있으면 추가 안 함
            return { followedArtists: [...state.followedArtists, artist] };
        }),

    unfollowArtist: (artistId) =>
        set((state) => ({
            followedArtists: state.followedArtists.filter((a) => a.id !== artistId),
        })),
}));

export default useArtistStore;
