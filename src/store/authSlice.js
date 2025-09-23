// store/authSlice.js
import { create } from 'zustand';

// 테스트 멤버 데이터 - loginId 필드로 통일
const memberData = [
    {
        id: 1,
        loginId: 'lush', // userid → loginId로 변경
        password: 'lush123',
        passwordConfirm: 'lush123',
        name: '홍길동',
        phoneNum1: '1234',
        phoneNum2: '5678',
        email: 'abc@naver.com',
        year: '2025',
        month: '09',
        day: '24',
    },
];

// 기존 데이터 마이그레이션 함수
const migrateOldData = (parsedData) => {
    if (!Array.isArray(parsedData)) return memberData;

    return parsedData.map((user) => {
        // userid 필드를 loginId로 변경 (하위 호환성 유지)
        if (user.userid && !user.loginId) {
            return {
                ...user,
                loginId: user.userid,
            };
        }
        return user;
    });
};

const loadInitialMembers = () => {
    try {
        const raw = localStorage.getItem('members');
        if (!raw) {
            localStorage.setItem('members', JSON.stringify(memberData));
            return memberData;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            // 기존 데이터 마이그레이션
            const migratedData = migrateOldData(parsed);
            // lush 계정이 있는지 확인
            const hasLushAccount = migratedData.some(
                (user) => user.loginId === 'lush' || user.userid === 'lush'
            );
            if (!hasLushAccount) {
                const updatedData = [...migratedData, ...memberData];
                localStorage.setItem('members', JSON.stringify(updatedData));
                return updatedData;
            }
            return migratedData;
        } else {
            localStorage.setItem('members', JSON.stringify(memberData));
            return memberData;
        }
    } catch (error) {
        console.error('회원 데이터 로드 중 오류:', error);
        localStorage.setItem('members', JSON.stringify(memberData));
        return memberData;
    }
};

const useAuthStore = create((set, get) => ({
    members: [],
    authed: false,
    user: null,
    loading: false,
    error: null,

    // 스토어 초기화 함수
    initialize: () => {
        try {
            const members = loadInitialMembers();
            const authed = JSON.parse(localStorage.getItem('authed')) || false;
            const user = JSON.parse(localStorage.getItem('user')) || null;

            set({ members, authed, user });
            console.log('스토어 초기화 완료:', {
                membersCount: members.length,
                authed,
                user,
                sampleUser: members.find((m) => m.loginId === 'lush' || m.userid === 'lush'),
            });
        } catch (error) {
            console.error('스토어 초기화 중 오류:', error);
            set({ members: memberData, authed: false, user: null });
        }
    },

    // 일반 로그인 함수 - loginId로 검색
    login: async ({ loginId, password }) => {
        const { members, initialize } = get();

        // members가 비어있으면 초기화
        if (members.length === 0) {
            initialize();
        }

        set({ loading: true, error: null });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            // loginId 또는 userid 필드로 사용자 찾기 (하위 호환성)
            const user = members.find(
                (member) => member.loginId === loginId || member.userid === loginId
            );

            console.log('로그인 시도:', {
                loginId,
                membersCount: members.length,
                foundUser: user,
                allUsers: members.map((m) => ({
                    loginId: m.loginId,
                    userid: m.userid,
                    name: m.name,
                })),
            });

            if (user && user.password === password) {
                localStorage.setItem('authed', JSON.stringify(true));
                localStorage.setItem('user', JSON.stringify(user));
                set({ authed: true, user, loading: false });
                return { success: true, user };
            } else {
                set({ loading: false });
                return {
                    success: false,
                    error: user ? '비밀번호가 틀렸습니다.' : '존재하지 않는 아이디입니다.',
                };
            }
        } catch (error) {
            set({ loading: false, error: error.message });
            return { success: false, error: '로그인 처리 중 오류가 발생했습니다.' };
        }
    },

    logout: () => {
        localStorage.removeItem('authed');
        localStorage.removeItem('user');
        set({ authed: false, user: null });
    },

    signup: (payload) => {
        const { members } = get();
        const newMember = {
            ...payload,
            id: Math.max(...members.map((m) => m.id), 0) + 1,
            // signup 시 loginId 필드 명시적으로 설정
            loginId: payload.loginId || payload.userid,
        };
        const updatedMembers = [...members, newMember];

        localStorage.setItem('members', JSON.stringify(updatedMembers));
        set({ members: updatedMembers });

        // 회원가입 후 바로 로그인 처리
        localStorage.setItem('authed', JSON.stringify(true));
        localStorage.setItem('user', JSON.stringify(newMember));
        set({ authed: true, user: newMember });

        return { success: true, user: newMember };
    },

    // 카카오 로그인 함수
    kakaoLogin: async (kakaoUserInfo) => {
        set({ loading: true, error: null });

        try {
            const { members } = get();

            // 카카오 사용자 정보로 기존 회원 찾기
            const existingUser = members.find(
                (member) =>
                    member.email === kakaoUserInfo.email ||
                    member.loginId === `kakao_${kakaoUserInfo.id}`
            );

            let user;
            let updatedMembers = members;

            if (existingUser) {
                user = existingUser;
            } else {
                // 새 카카오 회원 생성
                user = {
                    id: Math.max(...members.map((m) => m.id), 0) + 1,
                    loginId: `kakao_${kakaoUserInfo.id}`, // loginId 필드 사용
                    userid: `kakao_${kakaoUserInfo.id}`, // 하위 호환성을 위해 userid도 설정
                    name: kakaoUserInfo.nickname || '카카오사용자',
                    email: kakaoUserInfo.email || '',
                    password: '',
                    loginType: 'kakao',
                };

                updatedMembers = [...members, user];
                localStorage.setItem('members', JSON.stringify(updatedMembers));
            }

            // 로그인 처리
            localStorage.setItem('authed', JSON.stringify(true));
            localStorage.setItem('user', JSON.stringify(user));

            set({
                members: updatedMembers,
                authed: true,
                user,
                loading: false,
            });

            return { success: true, user };
        } catch (error) {
            set({
                loading: false,
                error: error.message,
            });
            return {
                success: false,
                error: '카카오 로그인 처리 중 오류가 발생했습니다.',
            };
        }
    },
}));

// 앱 시작 시 자동 초기화
useAuthStore.getState().initialize();

export default useAuthStore;
