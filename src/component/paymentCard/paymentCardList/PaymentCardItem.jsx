import React from 'react';
import { GoPlus } from 'react-icons/go';
import { LuMinus } from 'react-icons/lu';
import { IoIosClose } from 'react-icons/io';
import { useGoodsStore } from '../../../store';
const PaymentCardItem = ({ item }) => {
    const { id, title, img, remain, quantity, totalPrice } = item;
    const { delCart, upCount, downCount } = useGoodsStore();
    return (
        <li>
            <div className="item_list">
                <div className="pic">
                    <img src={img} alt="" />
                </div>
                <div className="list_text">
                    <strong>{title}</strong>
                    <p className="mini_con">
                        <span>남은수량</span>
                        <span>{remain}</span>
                    </p>

                    <div className="quantity_count">
                        <button className="down" onClick={() => downCount(id)}>
                            <i>
                                <LuMinus />
                            </i>
                        </button>
                        <p className="quantity">{quantity}</p>
                        <button className="up" onClick={() => upCount(id)}>
                            <i>
                                <GoPlus />
                            </i>
                        </button>
                    </div>
                </div>
            </div>
            {/* item_list */}
            <p className="price_close">
                <button onClick={() => delCart(id)}>
                    <i>
                        <IoIosClose />
                    </i>
                </button>
                <strong>₩ {totalPrice.toLocaleString()}</strong>
            </p>
        </li>
    );
};

export default PaymentCardItem;
