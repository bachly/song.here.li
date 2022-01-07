import React from 'react';
import '../styles/richtext.scss';
import '../styles/globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiper-custom.scss';
import Airtable from 'airtable';
import { AppDataContext } from '../contexts';
import Head from 'next/head';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

export default function MyApp({ Component, pageProps }) {
    const [allSongs, setAllSongs] = React.useState({});
    const [songGroups, setSongGroups] = React.useState(null);
    const [schedules, setSchedules] = React.useState(null);
    const [loadingAppData, setLoadingAppData] = React.useState(true);

    const SongListTable = base('Song List');
    const SchedulesTable = base('Schedule');

    React.useEffect(function onLoad() {
        const allSongs = {}

        /* Get Songs */
        SongListTable.select({
            view: "All Songs",
            filterByFormula: "AND(NOT({Group} = ''), NOT({Name} = ''))",
            fields: ['Name', 'Ready', 'Group', 'BPM', 'Key', 'YouTube Link', 'Chord Sheet', 'Author/Singer']
        }).all().then(function (records) {
            const groups = [];

            records.forEach(function (record) {
                const song = {
                    id: record.id,
                    'Name': record.get('Name') || null,
                    'Ready': record.get('Ready') || null,
                    'Group': record.get('Group') || null,
                    'Key': record.get('c') || null,
                    'BPM': record.get('BPM') || null,
                    'Key': record.get('Key') || null,
                    'Chord Sheet': record.get('Chord Sheet') || null,
                    'YouTube Link': record.get('YouTube Link') || null,
                    'Author/Singer': record.get('Author/Singer') || null,
                }

                allSongs[record.id] = song;

                const groupName = song['Group'];
                if (!!groupName) {
                    groups[groupName] = groups[groupName] || {};
                    groups[groupName][record.id] = song;
                }
            });

            setAllSongs(allSongs);
            setSongGroups(groups);

            /** Get Schedules */
            SchedulesTable.select({
                view: "All",
                fields: ['Date', 'Service', 'Song 1', 'Song 2', 'Song 3']
            }).all().then(function (records) {
                const schedules = records.map(function (s) {
                    return {
                        date: s.get('Date') || null,
                        service: s.get('Service') || null,
                        song1: s.get('Song 1') ? allSongs[s.get('Song 1')[0]] : null,
                        song2: s.get('Song 2') ? allSongs[s.get('Song 2')[0]] : null,
                        song3: s.get('Song 3') ? allSongs[s.get('Song 3')[0]] : null,
                    }
                });
                setSchedules(schedules);
                setLoadingAppData(false);
            })
        });
    }, [])

    React.useEffect(() => {
        console.log('App data ready:', {
            allSongs,
            songGroups,
            schedules,
            loadingAppData
        })
    }, [loadingAppData])

    function updateSong({ song, onSuccess }) {
        SongListTable.update([
            {
                id: song.id,
                "fields": {
                    "Chord Sheet": song.chordSheet
                }
            }
        ], function (error, records) {
            if (error) {
                alert(error);
                console.error(error);
                return;
            }

            const savedSong = {
                id: records[0].id,
                ...records[0].fields
            }
            console.log('Saved song:', savedSong);

            setAllSongs({
                ...allSongs,
                [records[0].id]: savedSong
            });

            onSuccess();
        });
    }

    return (
        <AppDataContext.Provider value={{
            allSongs,
            songGroups,
            schedules,
            loadingAppData,
            updateSong
        }}>
            <Head>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"></meta>
            </Head>
            <Component {...pageProps} />
        </AppDataContext.Provider>
    );
}