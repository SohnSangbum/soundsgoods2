import { useState } from 'react';
import { useGoodsStore } from '../../../store';
import './style.scss';
import { IoMdSearch } from 'react-icons/io';

const GoodsSideBar = () => {
    const {
        newSort,
        defaultSort,
        topSort,
        priceFilter1,
        priceFilter2,
        priceFilter3,
        priceFilter4,
        priceFilter5,
        artistSearch,
        filterCD,
    } = useGoodsStore();
    const fipi = [
        {
            id: 1,
            fil: '1만원 미만',
            isOn: false,
            action: priceFilter1,
        },
        {
            id: 2,
            fil: '1 ~ 2 만원대',
            isOn: false,
            action: priceFilter2,
        },
        {
            id: 3,
            fil: '3 ~ 4 만원대',
            isOn: false,
            action: priceFilter3,
        },
        {
            id: 4,
            fil: '5 ~ 6 만원대',
            isOn: false,
            action: priceFilter4,
        },
        {
            id: 5,
            fil: '10만원 이상',
            isOn: false,
            action: priceFilter5,
        },
    ];
    const [text, setText] = useState('');
    const onCh = (e) => {
        const { value } = e.target;
        setText(value);
    };
    const [filter, setFilter] = useState(fipi);
    const onPrice = (id) => {
        setFilter(
            filter.map((item) =>
                item.id === id ? { ...item, isOn: true } : { ...item, isOn: false }
            )
        );
        const selectedFilter = filter.find((item) => item.id === id);
        if (selectedFilter) {
            selectedFilter.action();
        }
    };
    return (
        <div className="goods_side_bar">
            <div className="side_inner">
                <h2>굿즈 찾기</h2>
                <div className="side_sort">
                    <div className="sort_text">
                        <p>정렬</p>
                        <img src="images/icons/black_top.png" alt="" />
                    </div>
                    <div className="side_sort_btns">
                        <button onClick={newSort}>
                            <span>최근순</span>
                        </button>
                        <button onClick={topSort}>
                            <span>인기순</span>
                        </button>
                        <button onClick={defaultSort}>
                            <span>기본순</span>
                        </button>
                    </div>
                </div>
                <div className="side_sort_price">
                    <div className="sort_text">
                        <p>가격</p>
                        <img src="images/icons/black_top.png" alt="" />
                    </div>
                    <ul className="sort_price">
                        {filter.map((item) => (
                            <li
                                key={item.id}
                                className={item.isOn ? 'on' : ''}
                                onClick={() => onPrice(item.id)}
                            >
                                <span></span>
                                <p>{item.fil}</p>
                            </li>
                        ))}
                        {/* <li className="on">
                            <span></span>
                            <p>1만원 미만</p>
                        </li>
                        <li>
                            <span></span>
                            <p>1 ~2만원대</p>
                        </li>
                        <li>
                            <span></span>
                            <p>3~4만원대</p>
                        </li>
                        <li>
                            <span></span>
                            <p>5~6만원대</p>
                        </li>
                        <li>
                            <span></span>
                            <p>10만원 이상</p>
                        </li> */}
                    </ul>
                </div>
                <div className="sort_input">
                    <div className="sort_text">
                        <p>필터</p>
                        <img src="images/icons/black_top.png" alt="" />
                    </div>
                    <form action="" className="artist_search">
                        <input
                            type="text"
                            name=""
                            id=""
                            placeholder="아티스트 찾기"
                            value={text}
                            onChange={onCh}
                        />
                        <i onClick={() => artistSearch(text)}>
                            <IoMdSearch />
                        </i>
                    </form>
                </div>
                <div className="sort_product">
                    <div className="sort_text">
                        <p>제품</p>
                    </div>
                    <ul className="product_filter">
                        <li onClick={() => filterCD('CD/DVD')}>CD / DVD</li>
                        <li onClick={() => filterCD('MD')}>Merch</li>
                        <li onClick={() => filterCD('Book')}>도서</li>
                        <li onClick={() => filterCD('Clothes')}>의류</li>
                        <li onClick={() => filterCD('Etc.')}>기타</li>
                    </ul>
                    <div className="sold_out">
                        <p>sold out 포함</p>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="sold_out">
                        <p>판매 예정 포함</p>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoodsSideBar;
