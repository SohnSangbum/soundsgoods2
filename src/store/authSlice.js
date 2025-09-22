// store/userStore.js
import { create } from 'zustand';

const initialMembers = [
    { id: 1, name: 'af', tel: '010-1111-2222', password: 'a1234', loginId: 'af' },
];

const useUserStore = create((set) => {
    // 초기값 로드
    const members = JSON.parse(localStorage.getItem('members')) || initialMembers;
    const authed = JSON.parse(localStorage.getItem('authed')) || false;
    const user = JSON.parse(localStorage.getItem('user')) || null;

    return {
        members,
        authed,
        user,

        login: ({ name, loginId }) => {
            localStorage.setItem('authed', JSON.stringify(true));
            localStorage.setItem('user', JSON.stringify({ name, loginId }));
            set({ authed: true, user: { name, loginId } });
        },

        logout: () => {
            localStorage.removeItem('authed');
            localStorage.removeItem('user');
            set({ authed: false, user: null });
        },

        signup: (payload) => {
            const newMember = { ...payload, id: members.length + 1 };
            const updatedMembers = [...members, newMember];
            localStorage.setItem('members', JSON.stringify(updatedMembers));
            set({ members: updatedMembers });
        },
    };
});

export default useUserStore;
