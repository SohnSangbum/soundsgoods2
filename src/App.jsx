import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
    Main,
    Oauth,
    Streaming,
    Artist,
    ArtistInfo,
    Genre,
    LatestMusic,
    Top100,
    Mymusic,
    Magazine,
    Goods,
    GoodsDetail,
    Cart,
    Popup,
    Pay,
    Complete,
    CardDetail,
    PaymentCard,
    CompleteCard,
    MyReservation,
} from './page';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import Layout from './common/Layout';
import './styled/reset.scss';
import Mymusic_Access from './component/mymusic/access/Mymusic_Access';
import Search from './page/search';
import ScrollTop from './ui/ScrollTop';
import useUserStore from './store/authSlice';
import { useEffect } from 'react';

const App = () => {
    const initialize = useUserStore((state) => state.initialize);
    useEffect(() => {
        initialize();
    }, []);
    return (
        <>
            <ToastContainer className="toast_custom" toastClassName="toast_custom_div" />
            <BrowserRouter>
                <ScrollTop />
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Main />} />
                        <Route path="oauth" element={<Oauth />} />
                        <Route path=":cardID" element={<CardDetail />} />
                        <Route path="mymusic" element={<Mymusic />} />
                        <Route path="search/:text" element={<Search />} />
                        <Route path="mymusic/access" element={<Mymusic_Access />} />
                        <Route path="magazine" element={<Magazine />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="popup" element={<Popup />} />
                        <Route path="pay" element={<Pay />} />
                        <Route path="paymentCard" element={<PaymentCard />} />
                        <Route path="myReservation" element={<MyReservation />} />
                        <Route path="complete" element={<Complete />} />
                        <Route path="completeCard" element={<CompleteCard />} />
                        <Route path="goods">
                            <Route index element={<Goods />} />
                            <Route path=":goodsID" element={<GoodsDetail />} />
                        </Route>
                        <Route path="streaming">
                            <Route index element={<Streaming />} />
                            <Route path="artist" element={<Artist />} />
                            <Route path="artistinfo/:id" element={<ArtistInfo />} />
                            <Route path="genre" element={<Genre />} />
                            <Route path="genre/:title" element={<Genre />} />
                            <Route path="latestmusic" element={<LatestMusic />} />
                            <Route path="top100" element={<Top100 />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};
export default App;
