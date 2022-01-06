import React from 'react';
import Airtable from 'airtable';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Toolbar from '../../components/Toolbar';
import PaneLeft from '../../components/PaneLeft';
import SongListWithLinks from '../../page-components/SongListWithLinks';
import { AppDataContext } from '../contexts';
import ChordSheetJS from 'chordsheetjs';
import Video from 'react-player';

const EDIT_MODE = {
    'IDLE': 'IDLE',
    'ACTIVE': 'ACTIVE',
    'ERROR': 'ERROR',
    'SUCCESS': 'SUCCESS'
}

export default function Song() {
    const router = useRouter();
    const [leftPaneState, setLeftPaneState] = React.useState('hidden');
    const appData = React.useContext(AppDataContext);

    function toggleLeftPane(event) {
        event && event.preventDefault();
        console.log(leftPaneState ? 'visible' : 'hidden');
        setLeftPaneState(leftPaneState === 'hidden' ? 'visible' : 'hidden');
    }

    React.useEffect(() => {
        if (!router || appData.loadingAppData) return;

        const firstId = Object.keys(appData.allSongs)[0];
        router.push(`/song/${firstId}`);
        console.log("firstSong:", appData.allSongs[firstId]);
    }, [router, appData])

    return <>
        <Header
            primaryName="Song"
            secondaryName="Here"
            userName="Bach"
        />

        <Toolbar
            toggleLeftPane={toggleLeftPane}
        />

        <div className="text-gray-300 flex items-center justify-center" style={{ height: '50vh' }}>Loading...</div>
    </>
}