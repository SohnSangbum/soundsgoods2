import { create } from 'zustand';
import goodsData from '../assets/api/goods';
import top_1_50 from '../assets/api/musicComponents/top_1_50';
import newData_51_100 from '../assets/api/musicComponents/newData_51_100';
import genre from '../assets/api/genre';
import artist_info from '../assets/api/artist_info';
import main_Artist_data from '../assets/api/main_Artist_data';
import cardData from '../assets/api/cardData';

// ✅ YouTube API 객체 가져오기 (SSR 환경 고려)
const getYT = () => {
    if (typeof window === 'undefined') return null;
    return window.YT || null;
};

// ✅ Zustand Store 생성
export const usemainAlbumStore = create((set, get) => {
    return {
        // ==================== 데이터 영역 ====================
        topData: top_1_50, // Top 1~50 음악 데이터
        genreData: genre, // 장르별 음악 데이터
        latestData: newData_51_100, // 최신곡 51~100 데이터
        artistData: artist_info, // 아티스트 정보 (앨범 포함)
        mainArtistData: main_Artist_data, // 메인 아티스트 정보

        // ==================== 플레이어/상태 관리 영역 ====================
        musicOn: false, // 음악 실행 여부
        musicModal: null, // 현재 재생 중인 음악 정보 (모달)
        players: {}, // YouTube Player 인스턴스 저장소
        ytReady: false, // YouTube API 로딩 여부
        currentPlayerId: null, // 현재 재생 중인 트랙 ID
        currentTime: 0, // 현재 재생 시간
        duration: 0, // 현재 트랙 전체 재생 길이
        timeInterval: null, // 재생 시간 업데이트 Interval
        currentVolume: 40, // 볼륨 상태

        // ==================== 플레이리스트 관리 영역 ====================
        currentPlaylist: [], // 현재 재생 목록
        currentIndex: 0, // 현재 재생 중인 곡의 인덱스
        currentPlaylistType: null, // 현재 플레이리스트 타입
        isShuffled: false, // 셔플 모드
        isRepeat: false, // 반복 모드
        originalPlaylist: [], // 셔플 전 원본 플레이리스트
        isPlaying: false, // 재생 상태

        // 초 단위를 mm:ss 포맷으로 변환
        formatTime: (time) => {
            if (!time || isNaN(time)) return '00:00';
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },

        // ==================== 플레이리스트 관리 기능 ====================
        // 플레이리스트 설정
        setPlaylist: (tracks, currentId, type) => {
            const currentIndex = tracks.findIndex((track) => track.id === currentId);
            set({
                currentPlaylist: tracks,
                originalPlaylist: [...tracks], // 원본 저장
                currentIndex: Math.max(0, currentIndex),
                currentPlaylistType: type,
            });
        },

        // 재생/일시정지 토글 함수(Con2에서만)
        togglePlayPause: (id, type) => {
            const { players, currentPlayerId, isPlaying } = get();
            const YT = getYT();

            if (currentPlayerId === id && players[id]) {
                // 같은 곡이 재생 중이면 토글
                try {
                    const player = players[id];
                    const playerState = player.getPlayerState();

                    if (playerState === YT.PlayerState.PLAYING) {
                        player.pauseVideo();
                        set({ isPlaying: false });
                    } else {
                        player.playVideo();
                        set({ isPlaying: true });
                    }
                } catch (error) {
                    console.error('Error toggling playback:', error);
                }
            } else {
                // 다른 곡이면 새로 재생 (처음부터)
                get().MStart(id, type);
            }
        },

        // 타입별 전체 트랙 가져오기
        getAllTracksByType: (type) => {
            const state = get();
            switch (type) {
                case 'top':
                    return state.topData;
                case 'latest':
                    return state.latestData;
                case 'genre':
                    return state.genreData.flatMap((genre) => genre.music);
                case 'artistInfo':
                    return state.artistData.flatMap((artist) => artist.album);
                case 'main':
                    return state.mainArtistData;
                default:
                    return [];
            }
        },

        // 셔플 토글
        toggleShuffle: () => {
            const { isShuffled, currentPlaylist, originalPlaylist, musicModal, isRepeat } = get();

            if (!isShuffled) {
                // 셔플 켜기: 현재 곡을 제외하고 나머지 섞기
                const currentTrack = musicModal;
                const otherTracks = originalPlaylist.filter(
                    (track) => track.id !== currentTrack.id
                );
                const shuffledTracks = [...otherTracks].sort(() => Math.random() - 0.5);
                const newPlaylist = [currentTrack, ...shuffledTracks];

                set({
                    currentPlaylist: newPlaylist,
                    currentIndex: 0,
                    isShuffled: true,
                    isRepeat: false, // 셔플 켜면 반복 끄기
                });
            } else {
                // 셔플 끄기: 원본 플레이리스트로 복원
                const currentTrack = musicModal;
                const originalIndex = originalPlaylist.findIndex(
                    (track) => track.id === currentTrack.id
                );

                set({
                    currentPlaylist: originalPlaylist,
                    currentIndex: originalIndex,
                    isShuffled: false,
                });
            }
        },

        // 반복 모드 토글
        toggleRepeat: () => {
            const { isRepeat } = get();
            set({
                isRepeat: !isRepeat,
                isShuffled: false, // 반복 켜면 셔플 끄기
            });
        },

        // 다음곡 재생
        playNext: () => {
            const { currentPlaylist, currentIndex, currentPlaylistType, isRepeat } = get();
            let nextIndex;

            if (currentIndex < currentPlaylist.length - 1) {
                nextIndex = currentIndex + 1;
            } else if (isRepeat) {
                // 반복 모드면 첫 번째 곡으로
                nextIndex = 0;
            } else {
                // 마지막 곡이면 재생 중지
                set({ isPlaying: false });
                return;
            }

            const nextTrack = currentPlaylist[nextIndex];
            get().MStart(nextTrack.id, currentPlaylistType);
            set({ currentIndex: nextIndex });
        },

        // 이전곡 재생
        playPrevious: () => {
            const { currentPlaylist, currentIndex, currentPlaylistType, isRepeat } = get();
            let prevIndex;

            if (currentIndex > 0) {
                prevIndex = currentIndex - 1;
            } else if (isRepeat) {
                // 반복 모드면 마지막 곡으로
                prevIndex = currentPlaylist.length - 1;
            } else {
                // 첫 번째 곡이면 그대로 처음부터 재생
                const currentTrack = currentPlaylist[0];
                const { players } = get();
                if (players[currentTrack.id]) {
                    players[currentTrack.id].seekTo(0);
                }
                return;
            }

            const prevTrack = currentPlaylist[prevIndex];
            get().MStart(prevTrack.id, currentPlaylistType);
            set({ currentIndex: prevIndex });
        },

        // ==================== 트랙 찾기 기능 ====================
        // id + type 기반으로 올바른 데이터에서 트랙 검색
        findTrack: (id, type) => {
            const state = get();
            switch (type) {
                case 'top':
                    return state.topData.find((item) => item.id === id);
                case 'latest':
                    return state.latestData.find((item) => item.id === id);
                case 'genre':
                    const genreMusics = state.genreData.flatMap((genre) => genre.music);
                    return genreMusics.find((musicItem) => musicItem.id === id);
                case 'artistInfo':
                    // 아티스트 안의 album 배열에서 검색
                    const artistAlbums = state.artistData.flatMap((artist) => artist.album);
                    return artistAlbums.find((albumItem) => albumItem.id === id);
                case 'main':
                    return state.mainArtistData.find((al) => al.id === id);
                default:
                    console.warn(`Unknown track type: ${type}`);
                    return null;
            }
        },

        // ==================== actv 상태 업데이트 ====================
        // 특정 트랙을 선택하면 해당 데이터의 actv만 true로 설정
        updateActiveTracks: (id, type) => {
            set((state) => {
                switch (type) {
                    case 'top':
                        return {
                            topData: state.topData.map((item) =>
                                item.id === id ? { ...item, actv: true } : { ...item, actv: false }
                            ),
                        };
                    case 'latest':
                        return {
                            latestData: state.latestData.map((item) =>
                                item.id === id ? { ...item, actv: true } : { ...item, actv: false }
                            ),
                        };
                    case 'genre':
                        return {
                            genreData: state.genreData.map((genre) => ({
                                ...genre,
                                music: genre.music.map((musicItem) =>
                                    musicItem.id === id
                                        ? { ...musicItem, actv: true }
                                        : { ...musicItem, actv: false }
                                ),
                            })),
                        };
                    case 'artistInfo':
                        return {
                            artistData: state.artistData.map((artist) => ({
                                ...artist,
                                album: artist.album.map((albumItem) =>
                                    albumItem.id === id
                                        ? { ...albumItem, actv: true }
                                        : { ...albumItem, actv: false }
                                ),
                            })),
                        };
                    case 'main':
                        return {
                            mainArtistData: state.mainArtistData.map((al) =>
                                al.id === id ? { ...al, actv: true } : { ...al, actv: false }
                            ),
                        };
                    default:
                        return state;
                }
            });
        },

        // ==================== 트랙 선택/실행 ====================
        onTrack: (id, type) => {
            const selectedTrack = get().findTrack(id, type);
            if (!selectedTrack) {
                console.error(`Track not found: id=${id}, type=${type}`);
                return;
            }

            // actv 업데이트
            get().updateActiveTracks(id, type);

            // YouTube 플레이어 생성
            get().createPlayer(selectedTrack);
            set({ musicModal: selectedTrack });
        },

        // ==================== YouTube API 초기화 ====================
        initYouTube: () => {
            return new Promise((resolve) => {
                if (typeof window === 'undefined') {
                    resolve(false);
                    return;
                }

                // 이미 로드된 경우
                if (window.YT && window.YT.Player) {
                    set({ ytReady: true });
                    resolve(true);
                    return;
                }

                // API 로딩 완료 시 콜백
                if (!window.onYouTubeIframeAPIReady) {
                    window.onYouTubeIframeAPIReady = () => {
                        set({ ytReady: true });
                        resolve(true);
                    };
                }

                // 타임아웃 처리
                const timeout = setTimeout(() => {
                    console.error('YouTube API loading timeout');
                    resolve(false);
                }, 10000);

                // 주기적으로 API 로드 여부 확인
                const interval = setInterval(() => {
                    if (window.YT && window.YT.Player) {
                        clearInterval(interval);
                        clearTimeout(timeout);
                        set({ ytReady: true });
                        resolve(true);
                    }
                }, 100);
            });
        },

        // ==================== YouTube Player 생성 ====================
        createPlayer: (track) => {
            return new Promise((resolve, reject) => {
                const { players, currentPlayerId, timeInterval } = get();
                const YT = getYT();

                if (!YT) {
                    reject(new Error('YouTube API not loaded'));
                    return;
                }
                if (!track || !track.track) {
                    reject(new Error('Invalid track data'));
                    return;
                }

                console.log(`Creating player for track: ${track.id} (${track.title})`);

                // 기존 플레이어 정지
                if (currentPlayerId && players[currentPlayerId] && currentPlayerId !== track.id) {
                    try {
                        players[currentPlayerId].pauseVideo();
                    } catch (error) {
                        console.log('Error pausing previous player:', error);
                    }
                }

                // 이전 interval 제거
                if (timeInterval) {
                    clearInterval(timeInterval);
                    set({ timeInterval: null });
                }

                // 이미 있는 플레이어면 그대로 사용
                if (players[track.id]) {
                    console.log('Using existing player:', track.id);
                    try {
                        const player = players[track.id];

                        // 처음부터 재생하도록 시간을 0으로 설정
                        player.seekTo(0);

                        const playerState = player.getPlayerState();
                        if (playerState === YT.PlayerState.PLAYING) {
                            player.pauseVideo();
                            // 잠시 후 다시 재생 (시간 초기화 적용을 위해)
                            setTimeout(() => {
                                player.seekTo(0);
                                player.playVideo();
                            }, 100);
                        } else {
                            player.seekTo(0);
                            player.playVideo();
                        }

                        set({ currentPlayerId: track.id, currentTime: 0 }); // currentTime도 0으로 초기화
                        resolve(player);
                    } catch (error) {
                        console.error('Error with existing player:', error);
                        delete players[track.id]; // 에러 시 제거
                    }
                    return;
                }

                // 새 DOM element 추가
                const playerId = `youtube-player-${track.id}-${track.track}`;
                let playerElement = document.getElementById(playerId);
                if (!playerElement) {
                    playerElement = document.createElement('div');
                    playerElement.id = playerId;
                    playerElement.style.display = 'none';
                    document.body.appendChild(playerElement);
                }

                try {
                    const player = new YT.Player(playerId, {
                        videoId: track.track,
                        width: '0',
                        height: '0',
                        playerVars: {
                            autoplay: 1,
                            modestbranding: 1,
                            rel: 0,
                            enablejsapi: 1,
                            origin: window.location.origin,
                        },
                        events: {
                            // 플레이어 준비 완료
                            onReady: (event) => {
                                console.log(`Player ready: ${track.id}`);
                                try {
                                    const duration = event.target.getDuration();
                                    const savedVolume = get().currentVolume; // 저장된 볼륨

                                    // 새 플레이어에 기존 볼륨 적용
                                    event.target.setVolume(savedVolume);

                                    set({
                                        duration,
                                        currentPlayerId: track.id,
                                    });
                                    resolve(event.target);
                                } catch (error) {
                                    console.error('Error in onReady:', error);
                                    reject(error);
                                }
                            },
                            // 상태 변화 이벤트
                            onStateChange: (event) => {
                                const { currentPlayerId } = get();
                                console.log(`State change: ${event.data} for ${track.id}`);

                                if (
                                    event.data === YT.PlayerState.PLAYING &&
                                    currentPlayerId === track.id
                                ) {
                                    // 재생 시작
                                    const interval = setInterval(() => {
                                        const state = get();
                                        if (
                                            state.currentPlayerId === track.id &&
                                            state.players[track.id]
                                        ) {
                                            try {
                                                const currentTime =
                                                    state.players[track.id].getCurrentTime();
                                                set({ currentTime });
                                            } catch (error) {
                                                console.error('Error getting current time:', error);
                                                clearInterval(interval);
                                            }
                                        } else {
                                            clearInterval(interval);
                                        }
                                    }, 1000);

                                    set({ timeInterval: interval, isPlaying: true });
                                } else if (event.data === YT.PlayerState.ENDED) {
                                    // 곡이 끝나면 자동으로 다음곡 재생
                                    set({ currentTime: 0, isPlaying: false });
                                    const { timeInterval } = get();
                                    if (timeInterval) {
                                        clearInterval(timeInterval);
                                        set({ timeInterval: null });
                                    }
                                    // 다음곡 자동 재생
                                    get().playNext();
                                } else if (event.data === YT.PlayerState.PAUSED) {
                                    // 일시정지
                                    set({ isPlaying: false });
                                    const { timeInterval } = get();
                                    if (timeInterval) {
                                        clearInterval(timeInterval);
                                        set({ timeInterval: null });
                                    }
                                }
                            },
                            // 에러 처리
                            onError: (event) => {
                                console.error(
                                    `YouTube Player Error: ${event.data} for ${track.id}`
                                );
                                const { players, timeInterval } = get();
                                if (players[track.id]) {
                                    delete players[track.id];
                                }
                                if (timeInterval) {
                                    clearInterval(timeInterval);
                                    set({ timeInterval: null });
                                }
                                reject(new Error(`YouTube error: ${event.data}`));
                            },
                        },
                    });

                    // players에 저장
                    set({
                        players: {
                            ...get().players,
                            [track.id]: player,
                        },
                    });
                } catch (error) {
                    console.error('Error creating YouTube player:', error);
                    reject(error);
                }
            });
        },

        // ==================== 트랙 재생 시작 ====================
        MStart: async (id, type) => {
            try {
                console.log(`MStart called: id=${id}, type=${type}`); // 디버깅용 로그

                const track = get().findTrack(id, type);
                if (!track) {
                    console.error(`Track not found: id=${id}, type=${type}`);
                    console.log('Available types:', Object.keys(get())); // 스토어 구조 확인
                    return;
                }

                // image → album_img 보정
                if (!track.album_img && track.image) {
                    track.album_img = track.image;
                }

                // 플레이리스트가 설정되지 않았거나 다른 타입이면 새로 설정
                const { currentPlaylistType } = get();
                if (currentPlaylistType !== type) {
                    console.log(`Setting new playlist: ${type}`);
                    const allTracks = get().getAllTracksByType(type);
                    if (!allTracks || allTracks.length === 0) {
                        console.error(`No tracks found for type: ${type}`);
                        return;
                    }
                    get().setPlaylist(allTracks, id, type);
                }

                // 음악 실행 상태 업데이트
                set({
                    musicOn: true,
                    musicModal: track,
                    isPlaying: true,
                    currentPlayerId: id,
                });

                // YouTube API 준비
                const state = get();
                if (!state.ytReady) {
                    console.log('Initializing YouTube API...');
                    const isReady = await state.initYouTube();
                    if (!isReady) {
                        console.error('YouTube API failed to initialize');
                        return;
                    }
                }

                const { currentPlayerId, players } = get();
                const YT = getYT();

                console.log(`Current player ID: ${currentPlayerId}, Target ID: ${id}`);

                if (currentPlayerId === id && players[id]) {
                    // 같은 트랙 재생 중이면 토글
                    try {
                        const playerState = players[id].getPlayerState();
                        console.log(`Current player state: ${playerState}`);

                        if (playerState === YT.PlayerState.PLAYING) {
                            players[id].pauseVideo();
                            set({ isPlaying: false });
                        } else {
                            players[id].playVideo();
                            set({ isPlaying: true });
                        }
                    } catch (error) {
                        console.error('Error controlling existing player:', error);
                        await get().createPlayer(track);
                    }
                } else {
                    // 새로운 트랙이면 새 플레이어 생성
                    console.log('Creating new player for track:', track);
                    await get().createPlayer(track);
                }

                // actv 업데이트
                get().updateActiveTracks(id, type);
            } catch (error) {
                console.error('Error in MStart:', error);
            }
        },

        // ==================== 트랙 정지 ====================
        MStop: (id) => {
            const { players, timeInterval } = get();
            if (players[id]) {
                try {
                    players[id].pauseVideo();
                    set({ currentPlayerId: null, isPlaying: false });
                    if (timeInterval) {
                        clearInterval(timeInterval);
                        set({ timeInterval: null });
                    }
                } catch (error) {
                    console.error('Error stopping player:', error);
                }
            }
        },

        // 실제 플레이어 볼륨 가져오기
        getCurrentPlayerVolume: (id) => {
            const { players } = get();
            if (players[id] && typeof players[id].getVolume === 'function') {
                try {
                    return players[id].getVolume();
                } catch (error) {
                    console.error('Error getting volume:', error);
                    return get().currentVolume;
                }
            }
            return get().currentVolume;
        },

        // 볼륨 업데이트 함수
        updateVolume: (volume) => {
            set({ currentVolume: volume });
        },

        // ==================== 볼륨 조절 ====================
        setVolume: (id, volume) => {
            const { players } = get();
            if (players[id] && typeof players[id].setVolume === 'function') {
                try {
                    players[id].setVolume(volume);
                    set({ currentVolume: volume }); // 상태도 함께 업데이트
                } catch (error) {
                    console.error('Error setting volume:', error);
                }
            }
        },

        // ==================== 모달 닫기 ====================
        closeModal: () => {
            const { players, musicModal, timeInterval } = get();
            if (musicModal && players[musicModal.id]) {
                try {
                    players[musicModal.id].stopVideo();
                } catch (error) {
                    console.error('Error stopping video:', error);
                }
            }

            if (timeInterval) {
                clearInterval(timeInterval);
            }

            // actv 상태 초기화
            get().updateActiveTracks(null, 'main'); // id=null로 모든 actv false 처리

            set({
                musicOn: false,
                musicModal: null,
                currentPlayerId: null,
                currentTime: 0,
                timeInterval: null,
                isPlaying: false,
            });
        },

        // ==================== 업데이트 액티브 ====================
        updateActiveTracks: (id = null, type) => {
            set((state) => {
                const resetActive = (arr) =>
                    arr.map((item) =>
                        id === null
                            ? { ...item, actv: false }
                            : item.id === id
                            ? { ...item, actv: true }
                            : { ...item, actv: false }
                    );

                switch (type) {
                    case 'top':
                        return { topData: resetActive(state.topData) };
                    case 'latest':
                        return { latestData: resetActive(state.latestData) };
                    case 'genre':
                        return {
                            genreData: state.genreData.map((genre) => ({
                                ...genre,
                                music: resetActive(genre.music),
                            })),
                        };
                    case 'artistInfo':
                        return {
                            artistData: state.artistData.map((artist) => ({
                                ...artist,
                                album: resetActive(artist.album),
                            })),
                        };
                    case 'main':
                        return { mainArtistData: resetActive(state.mainArtistData) };
                    default:
                        return state;
                }
            });
        },

        // ==================== 전체 플레이어 정리 ====================
        cleanupPlayers: () => {
            const { players, timeInterval } = get();

            Object.keys(players).forEach((playerId) => {
                try {
                    players[playerId].destroy();
                } catch (error) {
                    console.log(`Error destroying player ${playerId}:`, error);
                }
            });

            if (timeInterval) {
                clearInterval(timeInterval);
            }

            set({
                players: {},
                currentPlayerId: null,
                currentTime: 0,
                timeInterval: null,
                isPlaying: false,
            });
        },
    };
});

export const useGoodsStore = create((set, get) => {
    return {
        goods: localStorage.getItem('goods')
            ? JSON.parse(localStorage.getItem('goods'))
            : goodsData,
        cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
        payment: localStorage.getItem('payment') ? JSON.parse(localStorage.getItem('payment')) : [],
        complete: localStorage.getItem('complete')
            ? JSON.parse(localStorage.getItem('complete'))
            : [],
        iveGoods: localStorage.getItem('iveGoods')
            ? JSON.parse(localStorage.getItem('iveGoods'))
            : [],
        goodsMain: localStorage.getItem('goodsMain')
            ? JSON.parse(localStorage.getItem('goodsMain'))
            : [],
        goodsMain2: localStorage.getItem('goodsMain2')
            ? JSON.parse(localStorage.getItem('goodsMain2'))
            : [],
        goodspush: localStorage.getItem('goodspush')
            ? JSON.parse(localStorage.getItem('goodspush'))
            : [],
        card: localStorage.getItem('card') ? JSON.parse(localStorage.getItem('card')) : cardData,
        completeCard: localStorage.getItem('completeCard')
            ? JSON.parse(localStorage.getItem('completeCard'))
            : [],
        paymentCard: localStorage.getItem('paymentCard')
            ? JSON.parse(localStorage.getItem('paymentCard'))
            : [],
        wish: localStorage.getItem('wish') ? JSON.parse(localStorage.getItem('wish')) : [],

        // 상태로 변경
        itemTotal: 0,
        paymentTotal: 0,
        cartItemCount: 0,
        updateTotals: () => {
            const { cart } = get();
            const newItemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const newCartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

            set({
                itemTotal: newItemTotal,
                paymentTotal: newItemTotal + 2000,
                cartItemCount: newCartItemCount,
            });
        },
        updateTotals2: () => {
            const { payment } = get();
            const newItemTotal = payment.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const newCartItemCount = payment.reduce((sum, item) => sum + item.quantity, 0);

            set({
                itemTotal: newItemTotal,
                paymentTotal: newItemTotal + 2000,
                cartItemCount: newCartItemCount,
            });
        },
        shuffl: () => {
            const { goods } = get();
            const limitData = [...goods].sort(() => Math.random() - 0.5).slice(0, 5);
            localStorage.setItem('goodsMain', JSON.stringify(limitData));
            const limitData2 = [...goods].sort(() => Math.random() - 0.5).slice(0, 5);
            localStorage.setItem('goodsMain2', JSON.stringify(limitData2));
            const limitData3 = [...goods].sort(() => Math.random() - 0.5).slice(0, 6);
            localStorage.setItem('iveGoods', JSON.stringify(limitData3));
            const limitData4 = [...goods].sort(() => Math.random() - 0.5).slice(0, 2);
            localStorage.setItem('goodspush', JSON.stringify(limitData4));
            set({
                goodsMain: limitData,
                goodsMain2: limitData2,
                iveGoods: limitData3,
                goodspush: limitData4,
            });
        },
        completePush: (orderData) => {
            const { complete } = get();
            const newComplete = [...complete, orderData];
            localStorage.setItem('complete', JSON.stringify(newComplete));
            set({ complete: newComplete });
            localStorage.setItem('cart', JSON.stringify([]));
            set({ cart: [], payment: [] });
        },
        toggleCheck: (id) => {
            const { cart } = get();
            const updatedCart = cart.map((item) =>
                item.id === id ? { ...item, chk: !item.chk } : item
            );
            set({ cart: updatedCart });
            get().updateTotals();
        },

        toggleAllCheck: (checked) => {
            const { cart } = get();
            const updatedCart = cart.map((item) => ({ ...item, chk: checked }));
            set({ cart: updatedCart });
            get().updateTotals();
        },
        payPush2: (x) => {
            const { cart, payment } = get();
            const id = x.id;
            const checkedItems = cart.filter((item) => item.chk === true);
            const existingIds = new Set(payment.map((item) => item.id));
            const newItems = checkedItems.filter((item) => !existingIds.has(item.id));
            const updatedItems = [...newItems];
            localStorage.setItem('payment', JSON.stringify(updatedItems));
            set({ payment: updatedItems });
        },
        payPush: (x) => {
            const { goods, payment } = get();
            const id = x.id;
            const item = goods.find((item) => item.id === id);
            const updataItem = [item];
            localStorage.setItem('payment', JSON.stringify(updataItem));
            set({ payment: updataItem });
        },
        CardPush: (x) => {
            const { card, paymentCard } = get();
            const id = x.id;
            const item = card.find((item) => item.id === id);
            const updataItem = [item];
            localStorage.setItem('paymentCard', JSON.stringify(updataItem));
            set({ paymentCard: updataItem });
        },
        completeAdd: (orderData) => {
            const { completeCard } = get();
            const newComplete = [...completeCard, orderData];
            localStorage.setItem('completeCard', JSON.stringify(newComplete));
            set({ completeCard: newComplete });
            localStorage.setItem('paymentCard', JSON.stringify([]));
            set({ paymentCard: [] });
        },
        comDel: (x) => {
            const { completeCard } = get();
            const item = completeCard.filter((item) => {
                const hasItem = item.items.some((card) => card.id === x);
                return !hasItem;
            });
            localStorage.setItem('completeCard', JSON.stringify(item));
            set({ completeCard: item });
        },
        filterCD: (x) => {
            set((state) => ({
                goods: [...goodsData].filter((item) => item.category === x),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        newSort: () => {
            set((state) => ({
                goods: [...state.goods].sort((a, b) => a.title.localeCompare(b.title)),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        topSort: () => {
            set((state) => ({
                goods: [...state.goods].sort((a, b) => a.cpn.localeCompare(b.cpn)),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        defaultSort: () => {
            set((state) => ({
                goods: [...state.goods].sort((a, b) => a.id - b.id),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        priceFilter1: () => {
            set((state) => ({
                goods: [...goodsData].filter((item) => item.price < 10000),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        priceFilter2: () => {
            set((state) => ({
                goods: [...goodsData].filter((item) => item.price > 10000 && item.price < 20000),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        priceFilter3: () => {
            set((state) => ({
                goods: [...goodsData].filter((item) => item.price > 30000 && item.price < 40000),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        priceFilter4: () => {
            set((state) => ({
                goods: [...goodsData].filter((item) => item.price > 50000 && item.price < 60000),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        priceFilter5: () => {
            set((state) => ({
                goods: [...goodsData].filter((item) => item.price > 100000),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        artistSearch: (id) => {
            set((state) => ({
                goods: [...goodsData].filter((item) =>
                    item.artist.toLowerCase().includes(id.toLowerCase())
                ),
            }));
            window.scrollTo({
                top: 1500,
                behavior: 'smooth',
            });
        },
        wishPush: (x) => {
            const { goods, wish } = get();
            const id = x.id;

            // goods에서 아이템 찾기
            const item = goods.find((item) => item.id === id);

            if (!item) {
                console.error('Item not found in goods');
                return;
            }

            // 이미 wish에 있는지 확인
            const alreadyInWish = wish.some((wishItem) => wishItem.id === id);
            if (alreadyInWish) {
                console.log('Item already in wish list');
                return;
            }

            const add = [...wish, item];
            localStorage.setItem('wish', JSON.stringify(add));
            set({ wish: add });
        },

        cartPush: (x, quantity = 1) => {
            const { goods, cart } = get();
            const id = x.id;
            const currentGoodsItem = goods.find((item) => item.id === id);

            if (!currentGoodsItem) return;

            // 디버깅: 현재 goods 항목 확인
            console.log('Current goods item:', currentGoodsItem);
            console.log('Quantity in goods:', currentGoodsItem.quantity);

            const existingCartItemIndex = cart.findIndex((cartItem) => cartItem.id === id);

            if (existingCartItemIndex !== -1) {
                // 장바구니에 이미 있는 경우
                const updatedCart = [...cart];
                const existingItem = updatedCart[existingCartItemIndex];

                // 디버깅: 기존 장바구니 항목 확인
                console.log('Existing cart item:', existingItem);

                // goods의 quantity를 사용하여 증가
                const newQuantity = existingItem.quantity + currentGoodsItem.quantity;

                updatedCart[existingCartItemIndex] = {
                    ...existingItem,
                    quantity: newQuantity,
                    itemtotal: existingItem.price * newQuantity,
                    totalPrice: existingItem.price * newQuantity,
                };

                localStorage.setItem('cart', JSON.stringify(updatedCart));
                set({ cart: updatedCart });

                // 디버깅: 업데이트 후 확인
                console.log('Updated quantity:', newQuantity);
            } else {
                // 장바구니에 없는 경우 - goods의 quantity를 사용
                const newCartItem = {
                    ...currentGoodsItem,
                    quantity: currentGoodsItem.quantity, // goods의 quantity 사용
                    itemtotal: currentGoodsItem.price * currentGoodsItem.quantity,
                    totalPrice: currentGoodsItem.price * currentGoodsItem.quantity,
                };

                const newCart = [...cart, newCartItem];
                localStorage.setItem('cart', JSON.stringify(newCart));
                set({ cart: newCart });

                // 디버깅: 새로 추가된 항목 확인
                console.log('New cart item:', newCartItem);
            }

            // totals 업데이트 호출 추가
            get().updateTotals();
        },
        delCart: (x) => {
            const { cart } = get();
            const del = cart.filter((item) => item.id !== x);
            localStorage.setItem('cart', JSON.stringify(del));
            set({ cart: del });
        },
        delWish: (x) => {
            const { wish, goodsMain } = get();
            const del = wish.filter((item) => item.id !== x);
            const delItem = goodsMain.map((item) =>
                item.id === x ? { ...item, like: false } : item
            );
            localStorage.setItem('wish', JSON.stringify(del));
            localStorage.setItem('goodsMain', JSON.stringify(delItem));
            set({ wish: del, goodsMain: delItem });
        },
        upCountGoods: (x) => {
            const { goods } = get();
            const id = x;
            const item = goods.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                          itemtotal: item.price * (item.quantity + 1), // itemtotal 업데이트
                          totalPrice: item.price * (item.quantity + 1),
                      }
                    : item
            );

            set({ goods: item });
        },
        upCount: (x) => {
            const { cart } = get();
            const id = x;
            const item = cart.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                          itemtotal: item.price * (item.quantity + 1), // itemtotal 업데이트
                          totalPrice: item.price * (item.quantity + 1),
                      }
                    : item
            );
            localStorage.setItem('cart', JSON.stringify(item));
            set({ cart: item });
        },
        downCountGoods: (id) => {
            const { goods } = get();
            const itemIndex = goods.findIndex((goodsItem) => goodsItem.id === id);

            if (itemIndex !== -1) {
                const updatedGoods = [...goods];
                const item = updatedGoods[itemIndex];

                if (item.quantity > 1) {
                    updatedGoods[itemIndex] = {
                        ...item,
                        quantity: item.quantity - 1,
                        itemtotal: item.price * (item.quantity - 1), // itemtotal 업데이트
                        totalPrice: item.price * (item.quantity - 1),
                    };

                    set({ goods: updatedGoods });
                }
            }
        },
        downCount: (id) => {
            const { cart } = get();
            const itemIndex = cart.findIndex((cartItem) => cartItem.id === id);

            if (itemIndex !== -1) {
                const updatedCart = [...cart];
                const item = updatedCart[itemIndex];

                if (item.quantity > 1) {
                    updatedCart[itemIndex] = {
                        ...item,
                        quantity: item.quantity - 1,
                        itemtotal: item.price * (item.quantity - 1), // itemtotal 업데이트
                        totalPrice: item.price * (item.quantity - 1),
                    };
                    localStorage.setItem('cart', JSON.stringify(updatedCart));
                    set({ cart: updatedCart });
                }
            }
        },
        totalCart: (x) => {
            const { cart } = get();
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            localStorage.setItem('cart', JSON.stringify(total));
            set({ itemTotal: total });
        },
        isLike: (id) =>
            set((state) => {
                const newGoods = state.goods.map((item) =>
                    item.id === id ? { ...item, like: !item.like } : item
                );
                const newGoodsMain = state.goodsMain.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              like: !item.like,
                              count: !item.like ? item.count + 1 : item.count - 1,
                          }
                        : item
                );

                localStorage.setItem('goods', JSON.stringify(newGoods));
                localStorage.setItem('goodsMain', JSON.stringify(newGoodsMain));

                return { goods: newGoods, goodsMain: newGoodsMain };
            }),
        isLike2: (id) =>
            set((state) => {
                const newGoods = state.goods.map((item) =>
                    item.id === id ? { ...item, like: !item.like } : item
                );
                const newGoodsMain2 = state.goodsMain2.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              like: !item.like,
                              count: !item.like ? item.count + 1 : item.count - 1,
                          }
                        : item
                );

                localStorage.setItem('goods', JSON.stringify(newGoods));
                localStorage.setItem('goodsMain2', JSON.stringify(newGoodsMain2));

                return { goods: newGoods, goodsMain2: newGoodsMain2 };
            }),
        isLikeWithWish: (id) => {
            const { goods, wish } = get();

            const item = goods.find((item) => item.id === id);

            if (!item) {
                console.error('Item not found');
                return;
            }

            const newLikeState = !item.like;

            // 모든 상태 업데이트를 한 번에 처리
            set((state) => {
                // goods 업데이트
                const newGoods = state.goods.map((item) =>
                    item.id === id ? { ...item, like: newLikeState } : item
                );

                const newGoodsMain = state.goodsMain.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              like: newLikeState,
                              count: newLikeState
                                  ? (item.count || 0) + 1
                                  : Math.max(0, (item.count || 0) - 1),
                          }
                        : item
                );

                // wish 업데이트
                let newWish = [...state.wish];
                if (newLikeState) {
                    // 추가
                    const alreadyInWish = newWish.some((wishItem) => wishItem.id === id);
                    if (!alreadyInWish) {
                        newWish = [...newWish, { ...item, like: newLikeState }];
                    }
                } else {
                    // 제거
                    newWish = newWish.filter((wishItem) => wishItem.id !== id);
                }

                // localStorage 저장
                localStorage.setItem('goods', JSON.stringify(newGoods));
                localStorage.setItem('goodsMain', JSON.stringify(newGoodsMain));
                localStorage.setItem('wish', JSON.stringify(newWish));

                return {
                    goods: newGoods,
                    goodsMain: newGoodsMain,
                    wish: newWish,
                };
            });
        },
        isLike2WithWish: (id) => {
            const { goods, wish } = get();

            const item = goods.find((item) => item.id === id);

            if (!item) {
                console.error('Item not found');
                return;
            }

            set((state) => {
                const newGoods = state.goods.map((item) =>
                    item.id === id ? { ...item, like: !item.like } : item
                );

                const newGoodsMain2 = state.goodsMain2.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              like: !item.like,
                              count: !item.like ? item.count + 1 : item.count - 1,
                          }
                        : item
                );

                localStorage.setItem('goods', JSON.stringify(newGoods));
                localStorage.setItem('goodsMain2', JSON.stringify(newGoodsMain2));

                return { goods: newGoods, goodsMain2: newGoodsMain2 };
            });

            if (!item.like) {
                const alreadyInWish = wish.some((wishItem) => wishItem.id === id);

                if (!alreadyInWish) {
                    const add = [...wish, item];
                    localStorage.setItem('wish', JSON.stringify(add));
                    set({ wish: add });
                }
            }
        },
    };
});
