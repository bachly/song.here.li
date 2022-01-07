import React from 'react'
import _ from 'underscore';
import Airtable from 'airtable';
import { format } from 'date-fns';
import Layout from '../page-components/Layout';
import HeaderForHome from '../page-components/HeaderForHome';
import { Container, H2, Page } from '../page-components/Common';

var base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

export default function Home() {
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

    return (
        <Layout>
            <Page>
                <HeaderForHome title1="Song" title2="Here" />

                <Container>
                    <H2 icon="music">Songs</H2>

                    <div className="pt-6"></div>

                    {songGroups ?
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                            {songGroups.map(group => {
                                return <a key={group} href={`/list?group=${encodeURIComponent(group)}`} className="bg-gray-800 bg-opacity-50 hover:bg-opacity-90 duration-200 transition ease-in-out rounded-lg backdrop-blur-sm">
                                    <h2 className="text-white py-6 px-6">
                                        <div className="flex items-center justify-center">
                                            <div className="font-semibold text-base sm:text-lg md:text-xl">
                                                {group}
                                            </div>
                                        </div>
                                    </h2>
                                </a>
                            })}
                        </div> : <>
                            <div className="text-white text-center">
                                Loading...
                            </div>
                        </>}

                    <div className="py-12"></div>

                    <div className="bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-2xl">
                        <H2 icon="calendar">Schedules</H2>

                        <div className="pt-6"></div>

                        {schedules ?
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
                                {schedules.map((schedule, index) => {
                                    if (index > 5) {
                                        return;
                                    }

                                    return <button key={`schedule-${index}`} className="bg-gray-800 bg-opacity-50 hover:bg-teal-900 hover:bg-opacity-10 border border-transparent hover:border hover:border-gray-100 hover:border-opacity-10 rounded-xl duration-100 transition">
                                        <h3 className="py-2 px-5">
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-sm text-teal-400">{format(new Date(schedule.date), 'eee dd MMM yyyy')}</div>
                                                <div className="text-xs text-white bg-gray-800 px-2 rounded-md">{schedule.service}</div>
                                            </div>
                                        </h3>
                                        <div className="text-left pb-1">
                                            <div className="py-1 px-5">
                                                <div className="text-gray-400 text-sm">{schedule.song1 && schedule.song1['Name']}</div>
                                            </div>
                                            <div className="py-1 px-5">
                                                <div className="text-gray-400 text-sm">{schedule.song2 && schedule.song2['Name']}</div>
                                            </div>
                                            <div className="py-1 px-5">
                                                <div className="text-gray-400 text-sm">{schedule.song3 && schedule.song3['Name']}</div>
                                            </div>
                                        </div>
                                    </button>
                                })}
                            </div> : <>
                                <div className="text-white text-center">
                                    Loading...
                                </div>
                            </>}
                        <div className="pt-6"></div>
                    </div>

                    <div className="pt-24"></div>
                </Container>
            </Page>
        </Layout>
    );
}