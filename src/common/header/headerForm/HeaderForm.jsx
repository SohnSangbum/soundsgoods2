import React, { useEffect, useState } from 'react';
import './style.scss';
import { IoMdSearch } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const HeaderForm = () => {
    const [text, setText] = useState('');
    const [fade, setFade] = useState(true);
    const [word, setWord] = useState(['아이유', '빅뱅', '프로미스나인', 'BTS', '아이브']);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % word.length); // 순환
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    const navigate = useNavigate();

    const onSearch = (e) => {
        e.preventDefault();
        if (text.trim() === '') return;
        navigate(`/search/${text}`);
    };

    const onClick = (e) => {
        navigate(`/search/${word[current]}`);
    };

    return (
        <form onSubmit={onSearch}>
            <label htmlFor="searchInput" onClick={onClick}>
                {word[current]}
            </label>
            <input
                type="text"
                id="searchInput"
                placeholder="음악과 굿즈 검색을 한 번에!"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="search_header">
                <i>
                    <IoMdSearch />
                </i>
            </button>
        </form>
    );
};

export default HeaderForm;
