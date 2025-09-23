import React from 'react';
import '../popup/style.scss';
import Search_popupItem from './Search_popupItem';

const Search_popupList = () => {
    const popup = [
        {
            id: 1,
            img: '/images/main/main_con5_02.jpg',
            desc: `스포츠 게임 존(버스켓볼, 슈팅), 메시지존, 리스닝존, 공식 굿즈 판매 등의 인터랙티브 체험 제공`,
            title: '서울 송파 롯데월드몰 & 롯데월드타워',
            date: '25.08.01 - 25.09.30',
        },
        {
            id: 2,
            img: '/images/main/main_con5_03.jpg',
            desc: `멤버들의 어린 시절을 테마로 한 전시와 인터랙티브 코너`,
            title: '서울 성수동',
            date: '25.10.01 - 25.10.30',
        },
        {
            id: 3,
            img: '/images/main/main_con5_04.webp',
            desc: `미공개 사진 전시, 미디어 아트 상영, 한정 굿즈 및 체험, 이벤트 진행`,
            title: '서울 마포 스타 스퀘어',
            date: '25.11.01 - 25.11.30',
        },
        {
            id: 4,
            img: '/images/main/main_con5_05.jpg',
            desc: `예약 및 현장 대기 입장 방식, 오디오 가이드 제공, 미션 수행 선물 증정 방식`,
            title: '현대카드 뮤직 라이브러리',
            date: '25.12.01 - 25.12.30',
        },
        {
            id: 5,
            img: '/images/main/main_con5_06.png',
            desc: `아티스트의 무대 의상 및 소품 전시, 포토존, 팬 메시지 월`,
            title: '서울 홍대 복합문화공간',
            date: '26.01.05 - 26.02.05',
        },
        {
            id: 6,
            img: '/images/main/main_con5_07.jpg',
            desc: `360도 VR 콘서트 체험, 팬 참여형 아트워크, 친필 사인 전시`,
            title: '부산 센텀시티',
            date: '26.02.15 - 26.03.15',
        },
        {
            id: 7,
            img: '/images/main/main_con5_08.jpg',
            desc: `뮤직비디오 세트 재현, 댄스 챌린지 부스, 특별 상영 이벤트`,
            title: '대구 동성로',
            date: '26.04.01 - 26.04.30',
        },
        {
            id: 8,
            img: '/images/main/main_con5_09.jpg',
            desc: `아티스트 라이브 토크, 팬 아트 갤러리, 한정판 포스터 배포`,
            title: '광주 아시아문화전당',
            date: '26.05.01 - 26.05.31',
        },
        {
            id: 9,
            img: '/images/main/main_con5_10.jpg',
            desc: `스페셜 무대 의상 체험, 팬미팅 존, 미션 클리어 이벤트`,
            title: '인천 파라다이스 시티',
            date: '26.06.01 - 26.06.30',
        },
        {
            id: 10,
            img: '/images/main/main_con5_11.jpg',
            desc: `아티스트 다큐멘터리 상영, 기념 포토카드 제공, 팬들과의 소셜 이벤트`,
            title: '제주 신화월드',
            date: '26.07.01 - 26.07.31',
        },
    ];

    return (
        <div className="popupList">
            <div className="popupTitle">
                <h2>팝업스토어 검색결과</h2>
                <h3>더보기</h3>
            </div>
            <div className="popup">
                {popup.slice(0, 5).map((item) => (
                    <Search_popupItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Search_popupList;
