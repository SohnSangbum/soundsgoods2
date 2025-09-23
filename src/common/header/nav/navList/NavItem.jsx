import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ title, path, headerOn, id }) => {
    const navigate = useNavigate();

    return (
        <li
            onClick={() => {
                navigate(path);
            }}
            onMouseEnter={() => headerOn(id)}
        >
            {title}
        </li>
    );
};

export default NavItem;
