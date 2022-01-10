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
import { deepClone } from '../components/utils';
import { format, isFuture } from 'date-fns';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

export default function MyApp({ Component, pageProps }) {
    const [allSongs, setAllSongs] = React.useState({});
    const [songGroups, setSongGroups] = React.useState(null);
    const [schedules, setSchedules] = React.useState(null);
    const [loadingAppData, setLoadingAppData] = React.useState(true);

    const SongListTable = base('Song List');
    const SchedulesTable = base('Schedule');

    React.useEffect(function onLoad() {

        /* Get Songs */
        SongListTable.select({
            view: "All Songs",
            filterByFormula: "AND(NOT({Group} = ''), NOT({Name} = ''))",
            fields: ['Name', 'Ready', 'Group', 'BPM', 'Key', 'YouTube Link', 'Chord Sheet', 'Author/Singer']
        }).all().then(function (records) {
            const allSongs = {}
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
                fields: ['Datetime', 'Song 1', 'Song 2', 'Song 3']
            }).all().then(function (records) {
                const schedules = []

                records.forEach(function (record) {

                    const scheduleDatetime = record.get('Datetime') || null;
                    const formattedDatetime = scheduleDatetime ? format(new Date(scheduleDatetime), 'iii dd MMM hh:mm b') : null;

                    if (scheduleDatetime && isFuture(new Date(scheduleDatetime))) {
                        schedules.push({
                            id: record.id,
                            'Datetime': record.get('Datetime') || null,
                            'Formatted Datetime': formattedDatetime || null, 
                            'Song 1': record.get('Song 1') ? allSongs[record.get('Song 1')[0]] : null,
                            'Song 2': record.get('Song 2') ? allSongs[record.get('Song 2')[0]] : null,
                            'Song 3': record.get('Song 3') ? allSongs[record.get('Song 3')[0]] : null
                        })
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
        const songBackup = deepClone(allSongs[song.id]);

        // Optimistic UI: First, assume saving successfully
        const songAfterSaved = {
            ...allSongs[song.id],
            ...song
        }
        console.log('Optimistic saved song:', songAfterSaved);
        setAllSongs({
            ...allSongs,
            [song.id]: songAfterSaved
        });

        // Then, actually send data to backend
        SongListTable.update([
            {
                id: song.id,
                "fields": {
                    "Chord Sheet": song['Chord Sheet']
                }
            }
        ], function (error, records) {
            if (error) {
                alert("Error:", error);
                console.error(error);

                // If error, revert to backup
                setAllSongs({
                    ...allSongs,
                    [records[0].id]: songBackup
                });

                return;
            }

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