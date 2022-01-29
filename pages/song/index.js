import React from 'react';
import { useRouter } from 'next/router';
import { AppDataContext } from '../../contexts';
import Spinner from '../../components/Spinner';

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
        <Spinner />
    </>
}