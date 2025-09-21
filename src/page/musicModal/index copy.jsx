import { useCallback, useEffect, useState } from 'react';
import { usemainAlbumStore } from '../../store';
import './style.scss';

const MusicModal = () => {
    const {
        musicOn,
        musicModal,
        players,
        closeModal,
        setVolume,
        updateVolume,
        currentVolume,
        currentTime,
        duration,
        formatTime,
        isPlaying, // 스토어에서 가져오기
        isShuffled,
        isRepeat,
        toggleShuffle,
        toggleRepeat,
        playNext,
        playPrevious,
    } = usemainAlbumStore();

    const [isPlay, setIsPlay] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false); // 기본 축소형

    // 플레이어 상태 동기화
    useEffect(() => {
        if (musicModal && players[musicModal.id]) {
            setIsPlay(true);
            setVolume(musicModal.id, currentVolume);
        }
    }, [musicModal, players, currentVolume, setVolume]);

    // 재생중인 타임라인 이동
    const handleProgressDrag = (e) => {
        if (!musicModal || !players[musicModal.id]) return;
        const player = players[musicModal.id];
        const progress = e.currentTarget || e.target.closest('.progress-container');
        if (!progress) return;

        const move = (moveEvent) => {
            const rect = progress.getBoundingClientRect();
            const clientX = moveEvent.clientX ?? moveEvent.touches[0].clientX;
            let percent = (clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            const seekTime = percent * duration;
            player.seekTo(seekTime, true);
        };

        const stop = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', stop);
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
        window.addEventListener('touchmove', move);
        window.addEventListener('touchend', stop);

        move(e); // 초기 클릭 위치도 적용
    };

    // 볼륨 드래그 핸들러 수정
    const handleVolumeDrag = (e) => {
        if (!musicModal || !players[musicModal.id]) return;
        const player = players[musicModal.id];
        const volumeContainer = e.currentTarget || e.target.closest('.volume-slider');
        if (!volumeContainer) return;

        const move = (moveEvent) => {
            const rect = volumeContainer.getBoundingClientRect();
            const clientX = moveEvent.clientX ?? moveEvent.touches[0].clientX;
            let percent = (clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            const newVolume = Math.floor(percent * 100);

            // 스토어의 setVolume 사용 (플레이어와 상태 동시 업데이트)
            setVolume(musicModal.id, newVolume);

            // 설정 후 실제 볼륨 확인하여 재동기화
            setTimeout(() => {
                const actualVolume = player.getVolume?.();
                if (actualVolume !== undefined && actualVolume !== newVolume) {
                    updateVolume(actualVolume);
                }
            }, 50);
        };

        const stop = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', stop);
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
        window.addEventListener('touchmove', move);
        window.addEventListener('touchend', stop);

        move(e); // 초기 클릭 위치도 적용
    };

    const handlePlayPause = useCallback(() => {
        if (!musicModal || !players[musicModal.id]) return;
        const player = players[musicModal.id];
        const playerState = player.getPlayerState?.();

        if (playerState === 1) {
            player.pauseVideo?.();
        } else {
            player.playVideo?.();
        }
    }, [musicModal, players]);

    const handleShuffle = () => {
        toggleShuffle();
    };

    const handleRepeat = () => {
        toggleRepeat();
    };

    const handlePrevious = () => {
        playPrevious();
    };

    const handleNext = () => {
        playNext();
    };

    // 모달이 없으면 렌더하지 않음
    if (!musicOn || !musicModal) return null;
    const { artist, album, title, album_img, id } = musicModal;

    return (
        <>
            {/* 축소형 뮤직 플레이어 */}
            {!isExpanded && (
                <div className="bottom-music-player">
                    <div className="left-close">
                        <button className="close" onClick={closeModal}>
                            <img src="/images/icons/icon-gray-close.png" alt="" />
                        </button>
                    </div>
                    <div className="controller-wrap">
                        <div className="center-controller">
                            <button className="shuffle" onClick={handleShuffle}>
                                <img
                                    src={
                                        isShuffled
                                            ? '/images/icons/shurple_on.png'
                                            : '/images/icons/shurple.png'
                                    }
                                    alt="Shuffle"
                                />
                            </button>
                            <button className="btn-prev" onClick={handlePrevious}>
                                <img src="/images/icons/prev.png" alt="Previous" />
                            </button>
                            <button className="btn play" onClick={handlePlayPause}>
                                <img
                                    src={
                                        isPlaying
                                            ? '/images/icons/pause.png'
                                            : '/images/icons/play.png'
                                    }
                                    alt={isPlaying ? 'Pause' : 'Play'}
                                />
                            </button>
                            <button className="btn-next" onClick={handleNext}>
                                <img src="/images/icons/next.png" alt="Next" />
                            </button>
                            <button className="repeat" onClick={handleRepeat}>
                                <img
                                    src={
                                        isRepeat
                                            ? '/images/icons/loop_on.png'
                                            : '/images/icons/loop.png'
                                    }
                                    alt="Repeat"
                                />
                            </button>
                        </div>
                        <div className="center-bar">
                            <span className="current-time">{formatTime(currentTime)}</span>
                            <div
                                className="progress-container"
                                onMouseDown={handleProgressDrag}
                                onTouchStart={(e) => handleProgressDrag(e.touches[0])}
                            >
                                <div className="progress-bar">
                                    <div
                                        className="progress-handle"
                                        style={{
                                            width:
                                                duration > 0
                                                    ? `${(currentTime / duration) * 100}%`
                                                    : '0%',
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <span className="whole-play-time">{formatTime(duration)}</span>
                        </div>
                        <div className="right-controls">
                            <div className="volume-container">
                                <img
                                    src={
                                        currentVolume === 0
                                            ? '/images/icons/icon-mute.png'
                                            : '/images/icons/icon-volume.png'
                                    }
                                    alt={currentVolume === 0 ? 'Muted' : 'Volume'}
                                />
                                <div
                                    className="volume-slider"
                                    onMouseDown={handleVolumeDrag}
                                    onTouchStart={(e) => handleVolumeDrag(e.touches[0])}
                                >
                                    <div className="volume-bar">
                                        <div
                                            className="volume-handle"
                                            style={{ width: `${currentVolume}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-expand">
                        <button className="expand" onClick={() => setIsExpanded(true)}>
                            <img src="/images/icons/icon-expand.png" alt="" />
                        </button>
                    </div>
                </div>
            )}

            {/* 확장형 모달: isExpanded가 true일 때만 렌더 */}
            {isExpanded && (
                <div className="music_modal">
                    <div className="album_pic">
                        <div className="img-wrap">
                            <img
                                className="change"
                                src="/images/icons/change.png"
                                alt="Collapse"
                                onClick={() => setIsExpanded(false)}
                            />
                            <img
                                className="close"
                                src="/images/icons/close.png"
                                alt=""
                                onClick={closeModal}
                            />
                            <img src={album_img} alt="" />
                        </div>
                        <p>
                            <strong>{title}</strong>
                            <span>{artist}</span>
                        </p>
                    </div>
                    <div className="player_controll">
                        <button className="btn shurple" onClick={handleShuffle}>
                            <img
                                src={
                                    isShuffled
                                        ? '/images/icons/shurple_on.png'
                                        : '/images/icons/shurple.png'
                                }
                                alt="Shuffle"
                            />
                        </button>
                        <button className="btn prev" onClick={handlePrevious}>
                            <img src="/images/icons/prev.png" alt="Previous" />
                        </button>
                        <button className="btn play" onClick={handlePlayPause}>
                            <img
                                src={
                                    isPlaying ? '/images/icons/pause.png' : '/images/icons/play.png'
                                }
                                alt={isPlaying ? 'Pause' : 'Play'}
                            />
                        </button>
                        <button className="btn next" onClick={handleNext}>
                            <img src="/images/icons/next.png" alt="Next" />
                        </button>
                        <button className="btn loop" onClick={handleRepeat}>
                            <img
                                src={
                                    isRepeat
                                        ? '/images/icons/loop_on.png'
                                        : '/images/icons/loop.png'
                                }
                                alt="Repeat"
                            />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MusicModal;
