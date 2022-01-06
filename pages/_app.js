import React from 'react';
import '../styles/richtext.scss';
import '../styles/globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiper-custom.scss';
import Airtable from 'airtable';
import { AppDataContext } from '../contexts';
const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

export default function MyApp({ Component, pageProps }) {
    const [allSongs, setAllSongs] = React.useState({});
    const [songGroups, setSongGroups] = React.useState(null);
    const [schedules, setSchedules] = React.useState(null);
    const [loadingAppData, setLoadingAppData] = React.useState(true);

    React.useEffect(function onLoad() {
        const allSongs = {}

        /* Get Songs */
        base('Song List').select({
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

                if (song['Group'] !== null && groups.indexOf(song['Group']) === -1) {
                    groups.push(song['Group']);
                }
            });

            setAllSongs(allSongs);
            setSongGroups(groups);

            /** Get Schedules */
            base('Schedule').select({
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

    return (
        <AppDataContext.Provider value={{
            allSongs,
            songGroups,
            schedules,
            loadingAppData
        }}>
            <Component {...pageProps} />
        </AppDataContext.Provider>
    );
}