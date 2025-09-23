import { useState, useRef, useEffect } from 'react';
import './style.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import { isSameMonth } from 'date-fns';

registerLocale('ko', ko);

const payData = [
    {
        id: 1,
        con: '신용카드',
        isOn: true,
    },
    {
        id: 2,
        con: '휴대폰 결제',
        isOn: false,
    },
    {
        id: 3,
        con: '간편결제',
        isOn: false,
    },
    {
        id: 4,
        con: '카카오페이',
        isOn: false,
    },
];

const PaymentCardForm = ({ onFormDataChange, onDateChange }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // 데이트피커 열림 상태 추가
    const datePickerRef = useRef();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[date.getDay()];

        return `${year} .${month < 10 ? '0' + month : month} .${
            day < 10 ? '0' + day : day
        } (${weekday}) ~`;
    };

    const isSameMonthDate = (date) => {
        return isSameMonth(date, startDate);
    };

    const handleButtonClick = () => {
        setIsDatePickerOpen(true); // 데이트피커 열기
    };

    const close = () => {
        setIsDatePickerOpen(false); // 데이트피커 닫기
    };

    // 날짜 변경 핸들러 수정
    const handleDateChange = (date) => {
        setStartDate(date);
        // 부모 컴포넌트로 날짜 전달
        if (onDateChange) {
            onDateChange(date);
        }
        close(); // 날짜 선택 후 자동으로 닫기
    };

    const renderCustomHeader = ({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
    }) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        return (
            <div className="custom-datepicker-header">
                <div className="hh_con">
                    <div className="header-text">날짜 선택</div>
                    <button onClick={close}>
                        <img src="/images/icons/close2.png" alt="" />
                    </button>
                </div>
                <div className="header_date">
                    <button
                        type="button"
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        className="nav_button_left"
                    >
                        <img src="/images/icons/left_date.png" alt="" />
                    </button>
                    <div className="month-year-display">
                        {year}, {month < 10 ? `0${month}` : month}
                    </div>
                    <button
                        type="button"
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        className="nav_button_right"
                    >
                        <img src="/images/icons/right_date.png" alt="" />
                    </button>
                </div>

                <div className="bootom_button">
                    <button onClick={close}>날짜 지정 완료</button>
                </div>
            </div>
        );
    };

    const [data, setData] = useState(payData);
    const [formData, setFormData] = useState({
        recipient: '',
        phone: '',
        zipcode: '',
        address: '',
        detailAddress: '',
        memo: '',
    });

    const onOff = (x) => {
        setData(
            data.map((item) => (item.id === x ? { ...item, isOn: true } : { ...item, isOn: false }))
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (onFormDataChange) {
            onFormDataChange(formData);
        }
    }, [formData, onFormDataChange]);

    // 컴포넌트 마운트 시 초기 날짜 전달
    useEffect(() => {
        if (onDateChange) {
            onDateChange(startDate);
        }
    }, [onDateChange, startDate]);

    return (
        <div className="pay_delivery_form">
            <div className="name_text_box">
                <strong>받으시는분</strong>
                <div className="con inp">
                    <input
                        type="text"
                        name="recipient"
                        placeholder="이름을 입력해 주세요."
                        value={formData.recipient}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="휴대폰번호를 - 없이 입력해 주세요."
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    <div className="cont">
                        <input type="checkbox" name="" id="chk_name" />
                        <label htmlFor="chk_name" className="chh"></label>
                        <span>주문자와 동일</span>
                    </div>
                </div>
            </div>

            <div className="addr_box">
                <strong>주소</strong>
                <div className="con inp">
                    <div className="addr_text">
                        <input
                            type="text"
                            name="zipcode"
                            placeholder="우편번호"
                            value={formData.zipcode}
                            onChange={handleInputChange}
                        />
                        <button>주소검색</button>
                    </div>
                    <input
                        type="text"
                        name="address"
                        placeholder="기본주소를 입력해 주세요."
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="detailAddress"
                        placeholder="상세주소를 입력해 주세요."
                        value={formData.detailAddress}
                        onChange={handleInputChange}
                    />
                    <div className="cont">
                        <input type="checkbox" name="" id="chk_addr" />
                        <label htmlFor="chk_addr" className="chh"></label>
                        <span>최근 배송지</span>
                    </div>
                </div>
            </div>

            <div className="addr_memo">
                <strong>배송 메모</strong>
                <select name="memo" value={formData.memo} onChange={handleInputChange}>
                    <option value="">배송메모를 선택해주세요</option>
                    <option value="문 앞에 두고가세요">문 앞에 두고가세요</option>
                    <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                    <option value="배송전 문자주세요">배송전 문자주세요</option>
                    <option value="배송전 연락주세요">배송전 연락주세요</option>
                </select>
            </div>
            <div className="data_card">
                <strong>배송날짜</strong>
                <p className="data_style">{formatDate(startDate)}</p>

                <button className="date-select-button" onClick={handleButtonClick}>
                    <span>날짜 직접 선택</span>
                </button>

                <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    ref={datePickerRef}
                    className="hidden-datepicker"
                    locale="ko"
                    dateFormat="yyyy,MM"
                    popperPlacement="right-end"
                    renderCustomHeader={renderCustomHeader}
                    showPopperArrow={false}
                    monthsShown={1}
                    filterDate={isSameMonthDate}
                    open={isDatePickerOpen} // open 속성으로 데이트피커 표시 제어
                    onCalendarClose={close} // 캘린더가 닫힐 때 호출되는 콜백
                />
            </div>

            <div className="pay_content">
                <h3>결제수단</h3>
                <ul className="pay_content_list">
                    {data.map((item) => (
                        <li
                            key={item.id}
                            className={item.isOn ? 'on' : ''}
                            onClick={() => onOff(item.id)}
                        >
                            <span></span>
                            <strong>{item.con}</strong>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PaymentCardForm;
