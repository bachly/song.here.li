import React from 'react';
import HeaderToolbar from "../components/HeaderToolbar";
import SongListWithLinks from '../page-components/SongListWithLinks';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

export default function Ui() {
    const [allSongs, setAllSongs] = React.useState({});
    const [songGroups, setSongGroups] = React.useState(null);
    const [schedules, setSchedules] = React.useState(null);

    React.useEffect(function onLoad() {
        const allSongs = {}

        /* Get Songs */
        base('Song List').select({
            view: "All Songs",
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
            })
        });
    }, [])

    return <div>
        <HeaderToolbar
            primaryName="Song"
            secondaryName="Here"
            userName="Bach"
        />

        <div className={`left-pane left-pane--visible absolute transition transform duraiton-200 bg-gray-800 border-r border-gray-700 border-opacity-50`}>
            <div className="left-pane__header border-b border-gray-700 border-opacity-50" style={{ height: '45px' }}>
                <div className="h-full flex items-center px-4 justify-center select-none">
                    <span className="text-white font-light text-xl">List</span>
                </div>
            </div>
            <div className="left-pane__inner">
                <div className="text-white p-4">
                    <a className="text-white pb-6 block hover:underline" href="#" onClick={() => {}}>Open item</a>
                    <SongListWithLinks songs={allSongs} />
                </div>
            </div>
        </div>

    </div>
}