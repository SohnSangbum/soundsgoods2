import React, { useEffect } from 'react';
import { usemainAlbumStore } from '../../../../store';
import gsap from 'gsap';

const MainAlbumItem = ({ al }) => {
    const { id, artist, album, artist_img, album_img, yid, actv, type } = al; // type 추가
    const { MStart, onTrack } = usemainAlbumStore();

    // 컴포넌트 마운트 시 YouTube 플레이어 요소 미리 생성
    useEffect(() => {
        const playerElementId = `youtube-player-${id}`;
        let element = document.getElementById(playerElementId);

        if (!element) {
            element = document.createElement('div');
            element.id = playerElementId;
            element.style.display = 'none';
            document.body.appendChild(element);
        }

        return () => {
            // 필요시 cleanup 로직
        };
    }, [id]);

    const onMusic = () => {
        // type을 명시적으로 전달 (기본값 설정)
        const trackType = type || 'topData'; // type이 없을 경우 기본값 설정
        MStart(id, trackType);
        onTrack(id);
    };

    return (
        <li onClick={onMusic} className={actv ? 'active' : ''}>
            <div className="album_pic">
                <img src={album_img} alt={album} />
            </div>
            <div className="artist_pic">
                <div className="pic2">
                    <img src={artist_img} alt={artist} />
                </div>
            </div>
            <p>
                <strong>{album}</strong>
                <span>{artist}</span>
            </p>
        </li>
    );
};

export default React.memo(MainAlbumItem);
/*
  MStart: async (id, type) => {
            try {
                const track = get().findTrack(id, type);
                if (!track) {
                    console.error(`Track not found: id=${id}, type=${type}`);
                    return;
                }

                // image → album_img 보정
                if (!track.album_img && track.image) {
                    track.album_img = track.image;
                }

                // 플레이리스트가 설정되지 않았거나 다른 타입이면 새로 설정
                const { currentPlaylistType } = get();
                if (currentPlaylistType !== type) {
                    const allTracks = get().getAllTracksByType(type);
                    get().setPlaylist(allTracks, id, type);
                }

                // 음악 실행 상태 업데이트
                set({ musicOn: true, musicModal: track, isPlaying: true });

                // YouTube API 준비
                const state = get();
                if (!state.ytReady) {
                    const isReady = await state.initYouTube();
                    if (!isReady) {
                        console.error('YouTube API failed to initialize');
                        return;
                    }
                }

                const { currentPlayerId, players } = get();
                const YT = getYT();

                if (currentPlayerId === id && players[id]) {
                    // 같은 트랙 재생 중이면 토글
                    try {
                        const playerState = players[id].getPlayerState();
                        if (playerState === YT.PlayerState.PLAYING) {
                            players[id].pauseVideo();
                        } else {
                            players[id].playVideo();
                        }
                    } catch (error) {
                        console.error('Error controlling existing player:', error);
                        await get().createPlayer(track);
                    }
                } else {
                    // 새로운 트랙이면 새 플레이어 생성
                    await get().createPlayer(track);
                }

                // actv 업데이트
                get().updateActiveTracks(id, type);
            } catch (error) {
                console.error('Error in MStart:', error);
            }
        },
*/
