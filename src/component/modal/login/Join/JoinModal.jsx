import { IoClose } from 'react-icons/io5';
import './style.scss';
import { useState } from 'react';
import useUserStore from '../../../../store/authSlice';

const JoinModal = ({ onClose }) => {
    const [form, setForm] = useState({
        email: '',
        name: '',
        password: '',
        paschk: '',
        agreeAll: false,
        agreeService: false,
        agreeMarketing: false,
    });

    const onChecked = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };
            if (name.startsWith('agree') && name !== 'agreeAll') {
                const allChecked =
                    updated.agreeAll && updated.agreeMarketing && updated.agreeService;

                updated.agreeAll = allChecked;
            }
            return updated;
        });
    };
    const onCheckedAll = (e) => {
        const checked = e.target.checked;
        setForm((prev) => ({
            ...prev,
            agreeAll: checked,
            agreeService: checked,
            agreeMarketing: checked,
        }));
    };
    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const { login, signup } = useUserStore();
    const onSubmit = () => {
        if (!form.email || !form.name || !form.password || !form.paschk) {
            alert('모든 창을 입력해주세요.');
            return;
        }
        if (form.password !== form.paschk) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!form.agreeService) {
            alert('서비스 약관 동의가 필요합니다.');
            return;
        }

        // const users = JSON.parse(localStorage.getItem('users')) || [];
        // users.push(form);
        // localStorage.setItem('users', JSON.stringify(users));
        // signup({
        //     loginId: form.email,
        //     name: form.name,
        //     password: form.password,
        //     paschk: form.paschk,
        //     agreeAll: form.agreeAll,
        //     agreeService: form.agreeService,
        //     agreeMarketing: form.agreeMarketing,
        // });
        // login({ name: form.name, id: form.email });
        // onClose();
        // alert(`${users.name}님, 오신 걸 환영합니다.`);
        const { success, user } = signup({
            loginId: form.email,
            name: form.name,
            password: form.password,
            paschk: form.paschk,
            agreeAll: form.agreeAll,
            agreeService: form.agreeService,
            agreeMarketing: form.agreeMarketing,
        });

        if (success) {
            onClose();
            alert(`${user.name}님, 오신 걸 환영합니다.`);
        } else {
            alert('회원가입에 실패했습니다.');
        }
    };
    return (
        <div className="join">
            <p className="close">
                <IoClose onClick={onClose} />
            </p>
            <h1>회원가입</h1>

            <div className="joinInput">
                <p>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        placeholder="닉네임"
                        onChange={onChange}
                    />
                </p>
                <p>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder="이메일"
                        onChange={onChange}
                    />
                </p>
                <p>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        placeholder="비밀번호를 입력하세요."
                        onChange={onChange}
                    />
                </p>
                <p>
                    <input
                        type="password"
                        name="paschk"
                        value={form.paschk}
                        placeholder="비밀번호를 한 번 더 입력하세요."
                        onChange={onChange}
                    />
                </p>
                <div className="joinPhone">
                    <div className="joinPhoneNum">
                        <h2>휴대전화</h2>
                        <strong>010</strong>
                        <h4>-</h4>
                        <input
                            type="text"
                            name="phoneMid"
                            maxLength={4}
                            placeholder="0000"
                            value={form.phoneMid}
                            onChange={onChange}
                        />
                        <h4>-</h4>
                        <input
                            type="text"
                            name="phoneLast"
                            maxLength={4}
                            placeholder="0000"
                            value={form.phoneLast}
                            onChange={onChange}
                        />
                    </div>
                </div>
            </div>

            <div className="agree">
                <p>
                    <input
                        type="checkbox"
                        name="agreeAll"
                        id=""
                        checked={form.agreeAll}
                        style={{ width: 18, height: 18 }}
                        onChange={onCheckedAll}
                    />
                    서비스 약관 전체 동의
                </p>
                <p>
                    <img src="./images/icons/acodiun_down.png" alt="" />
                </p>
            </div>
            <div className="agreeDitaile">
                <p>
                    <input
                        className="agreeinput"
                        type="checkbox"
                        name="agreeService"
                        id=""
                        checked={form.agreeService}
                        style={{ width: 14, height: 14 }}
                        onChange={onChecked}
                    />
                    서비스이용약관 관련 동의 (필수)
                </p>
                <p>
                    <input
                        className="agreeinput"
                        type="checkbox"
                        name="agreeMarketing"
                        id=""
                        checked={form.agreeMarketing}
                        style={{ width: 14, height: 14 }}
                        onChange={onChecked}
                    />
                    쇼핑정보 수신 동의 (선택)
                </p>
            </div>

            <div className="btn2">
                <button className="on" type="button" onClick={onSubmit}>
                    회원가입
                </button>
            </div>
        </div>
    );
};

export default JoinModal;
