import React from 'react'
import _ from 'underscore';
import Airtable from 'airtable';
import { format } from 'date-fns';
import ChordSheetJS from 'chordsheetjs';
import Layout from '../page-components/Layout';

const AIRTABLE_API_KEY = 'keyjmQKQsWuyPGqct';
const AIRTABLE_BASE_ID = 'app8970gPuPsnHk2l';
var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export default function Home() {
    const [allSongs, setAllSongs] = React.useState({});
    const [songGroups, setSongGroups] = React.useState([]);
    const [schedules, setSchedules] = React.useState([]);

    const [popup, setPopup] = React.useState({
        visible: false,
        song: null
    })

    function closePopup(event) {
        event && event.preventDefault();

        document.getElementsByTagName('body')[0].classList = ""

        setPopup({
            visible: false
        })
    }

    function openPopup(song) {
        return (event) => {
            event && event.preventDefault();

            document.getElementsByTagName('body')[0].classList = "overflow-hidden"

            setPopup({
                visible: true,
                song
            })
        }
    }

    function onSongUpdateSuccess({ song }) {
        setAllSongs({
            ...allSongs,
            [song.id]: song
        })

        setPopup({
            ...popup,
            song
        })

        console.log("Updated song:", song);
    }

    function songsByGroup({ group }) {
        return _.compact(Object.keys(allSongs).map(id => {
            if (allSongs[id]['Group'] === group) {
                return allSongs[id]
            }
        }))
    }

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
            <div className="bg-gray-900 relative overflow-x-hidden">
                <header className="relative" style={{ height: "100vh" }}>
                    <div className="relative top-0 left-0 w-full z-0 bg-image bg-no-repeat bg-cover"
                        style={{ backgroundImage: "url(/img/green-waves.svg)", height: "50vh" }}>

                        {/* <div style={{
                            position: "absolute",
                            width: "100%",
                            bottom: "60px",
                            height: "100px",
                            clipPath: "url(#clip)",
                            transformOrigin: "left top",
                            transform: "scale(3)",
                            background: "linear-gradient(rgb(12 48 62) 41%, rgb(23 23 23 / 100%) 75%)"
                        }}>
                            <svg>
                                <clipPath id="clip">
                                    <path d="M2.27373675e-13,48.3123102 C47.2526058,39.8757818 86.9623358,35.6575176 119.12919,35.6575176 C178.250668,35.6575176 206.827687,48.0370982 280.432303,48.0370982 C367.079105,48.0370982 376.540461,35.6575176 458.684986,41.2972131 C506.645747,44.5899961 571.277749,53.0948639 660.91839,53.0948639 C710.843933,53.0948639 849.202679,35.6575176 913.373388,35.6575176 C1071.11616,35.6575176 1092.85843,33.5132008 1277.6238,53.0948639 C1314.26691,56.9783463 1427.93201,43.4008155 1534.45719,41.2972131 C1555.56953,40.8802979 1577.41713,43.1269263 1600,48.0370982 L1600,150 L2.27373675e-13,150 L2.27373675e-13,48.3123102 Z" id="Path" stroke="#000000"></path>
                                </clipPath>
                            </svg>
                        </div> */}

                        <div className="pt-36 lg:pt-48 xl:pt-56"></div>

                        <h1 className="relative z-10 px-4">
                            <div className="text-center text-gray-100 text-sm sm:text-base md:text-lg uppercase tracking-wider font-semibold">Welcome To</div>
                            <div className="text-white text-center text-4xl sm:text-5xl md:text-7xl">
                                <span className="font-bold">Worship</span>
                                <span className="font-light">Here</span>
                            </div>
                            <div className="mt-1 sm:mt-2 md:mt-3 text-center text-gray-100 text-sm md:text-xl font-regular">Personal Worship Song Books linked with AirTable</div>
                        </h1>
                    </div>
                </header>
            </div>
        </Layout>
    );
}