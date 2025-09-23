import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const Oauth = () => {
    useEffect(() => {
        toast('카카오 로그인 성공');
    }, []);
    return <div></div>;
};

export default Oauth;
