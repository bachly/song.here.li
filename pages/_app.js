import React from 'react';
import '../styles/richtext.scss';
import '../styles/globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiper-custom.scss';

export default function MyApp({ Component, pageProps }) {
    return (
        <Component {...pageProps} />
    );
}