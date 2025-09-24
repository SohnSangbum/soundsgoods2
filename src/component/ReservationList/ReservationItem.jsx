import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import { useGoodsStore } from '../../store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ReservationItem = ({ item, form, deliveryDate }) => {
    const { id, artist, title, price, release, cpn, img, remain } = item;
    const [mo, setMo] = useState(false);
    const { comDel } = useGoodsStore();
    const nav = useNavigate();

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(2); // 뒤의 2자리만
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}년 ${month}월 ${day}일`;
    };

    // 삭제 확인 함수
    const handleDelete = (id) => {
        Swal.fire({
            title: '정말 예약을 취소하겠습니까?',
            showCancelButton: true,
            confirmButtonText: '예약취소',
            cancelButtonText: '×',
            customClass: {
                popup: 'custom-swal-popup',
                cancelButton: 'cancel-btn-with-icon',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // 확인 버튼 클릭 시 삭제 실행
                comDel(id); // comDel 함수 호출

                // 삭제 성공 알림
                Swal.fire({
                    title: '취소 완료!',
                    text: '예약이 성공적으로 취소되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    timer: 2000,
                });
            }
        });
    };

    return (
        <li className="li">
            <div className="wish_pic">
                <img src={img} alt="" />
            </div>
            <div className="wish_list_text">
                <strong>{title}</strong>
                <div className="con_text">
                    <ul className="co co1">
                        <li>{artist}</li>
                        <li>카드</li>
                    </ul>
                    <ul className="co co2">
                        <li>{cpn}</li>
                        <li>{release}</li>
                    </ul>
                </div>
                <p className="wish_price">₩ {price.toLocaleString()}</p>
                <div className="con_text2">
                    <ul className="co co1">
                        <li>남은수량</li>
                        <li>{remain}</li>
                    </ul>
                    <ul className="co co2">
                        <li>리뷰</li>
                        <li>2,567건</li>
                    </ul>
                </div>
            </div>
            {/* orderDate를 사용하여 배송 예약 날짜 표시 */}
            <strong className="data_text">{formatDate(deliveryDate)} 배송 예약</strong>
            <div className="btn_close">
                <p className="ppp">
                    <button>예약 완료</button>
                </p>
                <button className="close" onClick={() => handleDelete(id)}>
                    <i>
                        <IoIosClose />
                    </i>
                </button>
            </div>
        </li>
    );
};

export default ReservationItem;
