import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Toolbar from '../../components/Toolbar';
import { AppDataContext } from '../../contexts';
import Sidebar from '../../components/Sidebar';

export default function Song() {
    const router = useRouter();
    const appData = React.useContext(AppDataContext);

    React.useEffect(() => {
        if (!router || appData.loadingAppData) return;

        const firstId = Object.keys(appData.allSongs)[0];
        router.push(`/${firstId}`);
        console.log("firstSong:", appData.allSongs[firstId]);
    }, [router, appData])

    return <>
        <Header
            primaryName="Song"
            secondaryName="Here"
            loading="true"
        />
    </>
}