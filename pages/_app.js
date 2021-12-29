import React from 'react';
import '../styles/richtext.scss';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <Component {...pageProps} />
    );
}