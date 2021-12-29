import React from 'react'
import _ from 'underscore';
import Airtable from 'airtable';
import { format } from 'date-fns';
import ChordSheetJS from 'chordsheetjs';
import Layout from '../page-components/Layout';

const AIRTABLE_API_KEY = 'keyjmQKQsWuyPGqct';
const AIRTABLE_BASE_ID = 'app8970gPuPsnHk2l';
var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export default function Songs() {
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
                <div className="relative z-0 bg-image bg-no-repeat w-full"
                    style={{ backgroundImage: "url(/img/green-waves.svg)", height: "500px", transform: "scale(1.5)", top: "-200px" }}></div>

                <div style={{
                    position: "absolute",
                    width: "100%",
                    top: "-200px",
                    height: "500px",
                    clipPath: "url(#clip)",
                    transformOrigin: "left top",
                    transform: "scale(1.5)",
                    background: "linear-gradient(rgb(45 212 191 / 15%) -18.72%, rgb(23 23 23) 70%)"
                }}>
                    <svg>
                        <clipPath id="clip">
                            <path d="M0,167.349743 C291.315392,108.649928 527.414268,105.278237 708.296627,157.23467 C889.178987,209.191103 1186.41344,203.087 1600,138.922362 L1600,500 L0,500 L0,167.349743 Z"></path>
                        </clipPath>
                    </svg>
                </div>

                <header className="fixed z-50 top-0 left-0 w-full bg-gray-900 bg-opacity-20 backdrop-blur-sm">
                    <div className="px-6">
                        <div className="flex items-center justify-between">
                            <div className="text-white text-2xl text-center xl:text-left py-3">
                                <span className="font-bold">Song</span>
                                <span className="font-light">Here</span>
                            </div>
                            <menu className="flex items-center justify-center">
                                <a href="#schedule" className="px-3 py-2 hover:bg-teal-900 hover:bg-opacity-70 duration-100 transition rounded-lg">
                                    <div className="w-6 h-6 text-white fill-current">
                                        <svg id="lnr-calendar-full" viewBox="0 0 1024 1024">
                                            <title>calendar-full</title>
                                            <path className="path1" d="M947.2 102.4h-128v-25.6c0-14.138-11.461-25.6-25.6-25.6s-25.6 11.462-25.6 25.6v25.6h-512v-25.6c0-14.138-11.462-25.6-25.6-25.6s-25.6 11.462-25.6 25.6v25.6h-128c-42.347 0-76.8 34.453-76.8 76.8v716.8c0 42.349 34.453 76.8 76.8 76.8h870.4c42.349 0 76.8-34.451 76.8-76.8v-716.8c0-42.347-34.451-76.8-76.8-76.8zM76.8 153.6h128v76.8c0 14.138 11.462 25.6 25.6 25.6s25.6-11.462 25.6-25.6v-76.8h512v76.8c0 14.138 11.461 25.6 25.6 25.6s25.6-11.462 25.6-25.6v-76.8h128c14.115 0 25.6 11.485 25.6 25.6v128h-921.6v-128c0-14.115 11.485-25.6 25.6-25.6zM947.2 921.6h-870.4c-14.115 0-25.6-11.485-25.6-25.6v-537.6h921.6v537.6c0 14.115-11.485 25.6-25.6 25.6z"></path><path className="path2" d="M384 512h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path3" d="M537.6 512h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path4" d="M691.2 512h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path5" d="M844.8 512h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path6" d="M230.4 614.4h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path7" d="M384 614.4h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path8" d="M537.6 614.4h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path9" d="M691.2 614.4h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path10" d="M844.8 614.4h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path11" d="M230.4 716.8h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path12" d="M384 716.8h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path13" d="M537.6 716.8h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path14" d="M691.2 716.8h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path15" d="M844.8 716.8h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path16" d="M230.4 819.2h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path17" d="M384 819.2h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path18" d="M537.6 819.2h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path19" d="M691.2 819.2h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path20" d="M844.8 819.2h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                        </svg>
                                    </div>
                                </a>
                                <a href="#songs" className="px-3 py-2 hover:bg-teal-900 hover:bg-opacity-70 duration-100 transition rounded-lg">
                                    <div className="w-6 h-6 text-white fill-current">
                                        <svg id="lnr-music-note" viewBox="0 0 1024 1024"><title>music-note</title><path className="path1" d="M1014.803 57.146c-5.826-4.864-13.509-6.891-20.982-5.533l-563.2 102.4c-12.173 2.213-21.021 12.816-21.021 25.187v583.632c-6.986-4.722-14.629-9.181-22.936-13.336-42.166-21.085-97.662-32.696-156.264-32.696s-114.098 11.611-156.264 32.696c-47.806 23.902-74.136 57.749-74.136 95.304s26.33 71.402 74.136 95.304c42.166 21.085 97.662 32.696 156.264 32.696s114.098-11.611 156.264-32.696c47.806-23.902 74.136-57.749 74.136-95.304v-516.294l512-94.549v426.475c-6.984-4.722-14.629-9.182-22.936-13.336-42.166-21.085-97.662-32.696-156.264-32.696s-114.098 11.611-156.264 32.696c-47.808 23.902-74.136 57.749-74.136 95.304s26.328 71.402 74.136 95.304c42.166 21.085 97.662 32.696 156.264 32.696s114.098-11.611 156.264-32.696c47.808-23.902 74.136-57.749 74.136-95.304v-665.6c0-7.59-3.368-14.79-9.197-19.654zM230.4 921.6c-102.563 0-179.2-40.547-179.2-76.8s76.637-76.8 179.2-76.8 179.2 40.547 179.2 76.8-76.637 76.8-179.2 76.8zM460.8 276.438v-75.874l512-93.091v74.416l-512 94.549zM793.6 819.2c-102.565 0-179.2-40.547-179.2-76.8s76.635-76.8 179.2-76.8c102.566 0 179.2 40.547 179.2 76.8s-76.634 76.8-179.2 76.8z"></path></svg>
                                    </div>
                                </a>
                            </menu>
                        </div>
                    </div>
                </header>

                <div id="schedule" className="relative" style={{ top: "-400px" }}></div>

                <div style={{ marginTop: "-300px" }}></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <div className="px-6 bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-2xl border border-teal-100 border-opacity-10">
                        <h2 className="text-white pt-6 pb-2">
                            <div className="flex items-center">
                                <div className="w-6 h-6 text-white fill-current mr-4">
                                    <svg id="lnr-calendar-full" viewBox="0 0 1024 1024">
                                        <title>calendar-full</title>
                                        <path className="path1" d="M947.2 102.4h-128v-25.6c0-14.138-11.461-25.6-25.6-25.6s-25.6 11.462-25.6 25.6v25.6h-512v-25.6c0-14.138-11.462-25.6-25.6-25.6s-25.6 11.462-25.6 25.6v25.6h-128c-42.347 0-76.8 34.453-76.8 76.8v716.8c0 42.349 34.453 76.8 76.8 76.8h870.4c42.349 0 76.8-34.451 76.8-76.8v-716.8c0-42.347-34.451-76.8-76.8-76.8zM76.8 153.6h128v76.8c0 14.138 11.462 25.6 25.6 25.6s25.6-11.462 25.6-25.6v-76.8h512v76.8c0 14.138 11.461 25.6 25.6 25.6s25.6-11.462 25.6-25.6v-76.8h128c14.115 0 25.6 11.485 25.6 25.6v128h-921.6v-128c0-14.115 11.485-25.6 25.6-25.6zM947.2 921.6h-870.4c-14.115 0-25.6-11.485-25.6-25.6v-537.6h921.6v537.6c0 14.115-11.485 25.6-25.6 25.6z"></path><path className="path2" d="M384 512h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path3" d="M537.6 512h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path4" d="M691.2 512h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path5" d="M844.8 512h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path6" d="M230.4 614.4h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path7" d="M384 614.4h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path8" d="M537.6 614.4h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path9" d="M691.2 614.4h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path10" d="M844.8 614.4h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path11" d="M230.4 716.8h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path12" d="M384 716.8h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path13" d="M537.6 716.8h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path14" d="M691.2 716.8h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path15" d="M844.8 716.8h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path16" d="M230.4 819.2h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path17" d="M384 819.2h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path><path className="path18" d="M537.6 819.2h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path19" d="M691.2 819.2h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path className="path20" d="M844.8 819.2h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                    </svg>
                                </div>
                                <div className="font-semibold text-xl">
                                    Performances
                                </div>
                            </div>
                        </h2>

                        <div className="pt-6"></div>

                        {schedules.length > 0 ?
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {schedules.map((schedule, index) => {
                                    if (index > 11) {
                                        return;
                                    }

                                    return <button key={`schedule-${index}`} className="hover:bg-teal-900 hover:bg-opacity-10 border border-transparent hover:border hover:border-gray-100 hover:border-opacity-10 rounded-xl duration-100 transition">
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

                    <div id="songs" className="pt-36"></div>

                    <h2 className="text-white text-2xl text-center font-thin">Song Groups</h2>

                    <div id="songs" className="pt-12"></div>

                    <div className="grid grid-cols-1 gap-12">
                        {songGroups.map(group => {
                            return <div key={group} className="bg-gray-900 border border-teal-100 border-opacity-10 rounded-2xl">
                                <h2 className="text-white py-6 px-6">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 text-white fill-current mr-4">
                                            <svg id="lnr-music-note" viewBox="0 0 1024 1024"><title>music-note</title><path className="path1" d="M1014.803 57.146c-5.826-4.864-13.509-6.891-20.982-5.533l-563.2 102.4c-12.173 2.213-21.021 12.816-21.021 25.187v583.632c-6.986-4.722-14.629-9.181-22.936-13.336-42.166-21.085-97.662-32.696-156.264-32.696s-114.098 11.611-156.264 32.696c-47.806 23.902-74.136 57.749-74.136 95.304s26.33 71.402 74.136 95.304c42.166 21.085 97.662 32.696 156.264 32.696s114.098-11.611 156.264-32.696c47.806-23.902 74.136-57.749 74.136-95.304v-516.294l512-94.549v426.475c-6.984-4.722-14.629-9.182-22.936-13.336-42.166-21.085-97.662-32.696-156.264-32.696s-114.098 11.611-156.264 32.696c-47.808 23.902-74.136 57.749-74.136 95.304s26.328 71.402 74.136 95.304c42.166 21.085 97.662 32.696 156.264 32.696s114.098-11.611 156.264-32.696c47.808-23.902 74.136-57.749 74.136-95.304v-665.6c0-7.59-3.368-14.79-9.197-19.654zM230.4 921.6c-102.563 0-179.2-40.547-179.2-76.8s76.637-76.8 179.2-76.8 179.2 40.547 179.2 76.8-76.637 76.8-179.2 76.8zM460.8 276.438v-75.874l512-93.091v74.416l-512 94.549zM793.6 819.2c-102.565 0-179.2-40.547-179.2-76.8s76.635-76.8 179.2-76.8c102.566 0 179.2 40.547 179.2 76.8s-76.634 76.8-179.2 76.8z"></path></svg>
                                        </div>
                                        <div className="font-semibold text-xl">
                                            {group}
                                        </div>
                                    </div>
                                </h2>
                                <SongList songs={songsByGroup({ group: group })} openPopup={openPopup} />
                                <div className="pt-10"></div>
                            </div>
                        })}

                    </div>
                </div>

                <div className="pt-24"></div>

                {/* Popup */}
                {
                    popup.visible && popup.song ?
                        <div id="popup" className={`fixed z-50 w-full h-full left-0 top-0`}>
                            <button className="fixed z-50 w-full h-full bg-gray-900 bg-opacity-30 backdrop-blur-sm cursor-zoom-out" onClick={closePopup}>
                                <span className="sr-only">Close popup</span>
                            </button>
                            <div className="w-full h-screen flex items-center justify-center">
                                <div className="w-full max-w-7xl z-50 realtive bg-gray-800 bg-opacity-80 border border-gray-700 border-opacity-30" style={{ height: '95vh', width: '95vw' }}>
                                    <div className="w-full flex items-center justify-between py-2 px-6 bg-gray-800 border-b-2 border-teal-700 border-opacity-30">
                                        <div>
                                            <div className="pt-2"></div>
                                            <h1 className="text-teal-400 text-lg font-bold leading-tight">{popup.song['Name']}</h1>

                                            <div className="pt-2"></div>
                                            <div className="flex flex-wrap items-center">
                                                <div className="text-sm mr-4">
                                                    <span className="text-gray-400 text-sm mr-2">Key:</span>
                                                    <span className="text-white text-sm">{popup.song['Key']}</span>
                                                </div>
                                                <div className="text-sm mr-4">
                                                    <span className="text-gray-400 text-sm mr-2">BPM:</span>
                                                    <span className="text-white text-sm">{popup.song['BPM']}</span>
                                                </div>
                                                <div className="text-sm mr-4">
                                                    <span className="text-gray-400 text-sm mr-2">Author/Singer:</span>
                                                    <span className="text-white text-sm">{popup.song['Author/Singer']}</span>
                                                </div>
                                            </div>
                                            <div className="pt-2"></div>
                                        </div>
                                        <div className="text-right">
                                            <button className="inline-block text-white text-center" onClick={closePopup}>
                                                <div className="text-white fill-current w-8 h-8 bg-gray-800 rounded-md p-2">
                                                    <svg id="lnr-cross" viewBox="0 0 1024 1024"><title>cross</title><path className="path1" d="M548.203 537.6l289.099-289.098c9.998-9.998 9.998-26.206 0-36.205-9.997-9.997-26.206-9.997-36.203 0l-289.099 289.099-289.098-289.099c-9.998-9.997-26.206-9.997-36.205 0-9.997 9.998-9.997 26.206 0 36.205l289.099 289.098-289.099 289.099c-9.997 9.997-9.997 26.206 0 36.203 5 4.998 11.55 7.498 18.102 7.498s13.102-2.499 18.102-7.499l289.098-289.098 289.099 289.099c4.998 4.998 11.549 7.498 18.101 7.498s13.102-2.499 18.101-7.499c9.998-9.997 9.998-26.206 0-36.203l-289.098-289.098z"></path></svg>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ height: "calc(95vh - 8rem)" }}>
                                        <SongDetails song={popup.song} onSongUpdateSuccess={onSongUpdateSuccess} />
                                    </div>
                                </div>
                            </div>
                        </div> : <></>
                }
            </div >
        </Layout>
    );
}

function SongList({ songs, openPopup }) {
    if (!songs) return <></>

    return <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-8 px-2 md:px-6">
        {songs?.map((song, index) => {
            if (index < 12) {
                return <button key={`song-${song.id}`}
                    onClick={openPopup(song)}
                    className="text-left py-1 px-4 md:px-6 hover:bg-teal-900 hover:bg-opacity-10 border border-transparent hover:border hover:border-gray-100 hover:border-opacity-10 rounded-md duration-100 transition cursor-pointer">
                    <h3 className="font-bold text-teal-400 text-sm">{song['Name']}</h3>
                    <div className="font-light flex items-center">
                        <span className="mr-2">
                            {song['Author/Singer'] ?
                                <span className="text-gray-400 text-sm">{song['Author/Singer']}</span>
                                : <span className="text-gray-400 text-sm">Unknown</span>}
                        </span>
                        {song['Key'] ?
                            <span className="mr-2">
                                <span className="text-xs text-white bg-gray-800 px-2 rounded-md">
                                    {song['Key']}
                                </span>
                            </span>
                            : <></>}
                    </div>
                </button>
            }
        })}</div>
}

function SongDetails({ song, onSongUpdateSuccess }) {
    const [editedChordSheet, setEditedChordSheet] = React.useState('');
    const [editMode, setEditMode] = React.useState(EDIT_MODE.IDLE);
    const [editMessage, setEditMessage] = React.useState('');

    const parser = new ChordSheetJS.ChordProParser();
    const formatter = new ChordSheetJS.HtmlDivFormatter();

    function cancelEditing(event) {
        event.preventDefault();
        setEditMode(EDIT_MODE.IDLE)
    }

    function startEditing(event) {
        event.preventDefault();
        setEditMode(EDIT_MODE.ACTIVE);
        setEditedChordSheet(song['Chord Sheet'] ? song['Chord Sheet'] : '')
    }

    function handleOnChangeChordSheet(event) {
        setEditedChordSheet(event.target.value)
    }

    function saveEditing(event) {
        event.preventDefault();

        base('Song List').update([
            {
                id: song.id,
                "fields": {
                    "Chord Sheet": editedChordSheet
                }
            }
        ], function (err, records) {
            if (err) {
                setEditMode(EDIT_MODE.ERROR);
                setEditMessage(err.message);
                console.error(err);
                alert(err);
                return;
            }

            setEditMode(EDIT_MODE.SUCCESS);
            setEditMessage('Successfully updated');
            console.log('Successfully updated', {
                id: records[0].id,
                ...records[0].fields
            });
            onSongUpdateSuccess({
                song: {
                    id: records[0].id,
                    ...records[0].fields
                }
            })

            setTimeout(function () {
                setEditMessage('');
            }, 3000)
        })
    }

    function formatChordSheet(chordProText) {
        const song = parser.parse(chordProText);
        return formatter.format(song);
    }

    return (
        <div className="w-full h-full overflow-y-scroll">
            <div className="pt-6"></div>

            <style>
                {ChordSheetJS.HtmlDivFormatter.cssString('.chordSheetViewer')}
                {`
                .chord { color: rgb(45, 212, 191) }
                .chordSheetViewer .column {
                    margin-bottom: 1rem;
                }
                .chordSheetViewer .row {
                    flex-wrap: wrap;
                    line-height: 1.5;
                }
                .chordSheetViewer .paragraph:not(:last-child) {
                    margin-bottom: 2rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px dashed #333;
                }
                `}
            </style>

            {song ?
                <>
                    <div className="">
                        <div className="flex items-center px-6">
                            <h4 className="text-gray-400 uppercase text-sm mr-2">Chord sheet</h4>
                            <div className="flex items-center">
                                {editMode === EDIT_MODE.IDLE || editMode === EDIT_MODE.SUCCESS ?
                                    <button onClick={startEditing} className="w-8 h-8 text-white fill-current p-2 hover:bg-teal-900 rounded-lg duration-100 transition">
                                        <svg id="lnr-pencil" viewBox="0 0 1024 1024"><title>pencil</title><path className="path1" d="M978.101 45.898c-28.77-28.768-67.018-44.611-107.701-44.611-40.685 0-78.933 15.843-107.701 44.611l-652.8 652.8c-2.645 2.645-4.678 5.837-5.957 9.354l-102.4 281.6c-3.4 9.347-1.077 19.818 5.957 26.85 4.885 4.888 11.43 7.499 18.104 7.499 2.933 0 5.891-0.502 8.744-1.541l281.6-102.4c3.515-1.28 6.709-3.312 9.354-5.958l652.8-652.8c28.768-28.768 44.613-67.018 44.613-107.702s-15.843-78.933-44.613-107.701zM293.114 873.883l-224.709 81.71 81.712-224.707 566.683-566.683 142.997 142.997-566.683 566.683zM941.899 225.098l-45.899 45.899-142.997-142.997 45.899-45.899c19.098-19.098 44.49-29.614 71.498-29.614s52.4 10.518 71.499 29.616c19.098 19.098 29.616 44.49 29.616 71.498s-10.52 52.4-29.616 71.498z"></path></svg>
                                    </button>
                                    : <>
                                        <button onClick={cancelEditing} className="h-8 text-white text-sm p-1 px-3 rounded-lg bg-gray-700 hover:bg-teal-900 mr-2">Cancel</button>
                                        <button onClick={saveEditing} className="h-8 text-white text-sm p-1 px-3 rounded-lg bg-gray-700 hover:bg-teal-900">Save</button>
                                    </>}
                                <div className="text-white text-sm">
                                    {editMode === EDIT_MODE.SUCCESS ?
                                        <div className="text-teal-500">{editMessage}</div> : <></>}

                                    {editMode === EDIT_MODE.ERROR ?
                                        <div className="text-red-400">{editMessage}</div> : <></>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-3"></div>
                        
                        {editMode === EDIT_MODE.IDLE || editMode === EDIT_MODE.SUCCESS ?
                            <div className="text-gray-200 bg-gray-900 bg-opacity-80 font-mono leading-loose text-sm sm:text-base md:text-xl py-4 px-6 shadow-inner">
                                <div className="chordSheetViewer"
                                    dangerouslySetInnerHTML={{ __html: song['Chord Sheet'] ? formatChordSheet(song['Chord Sheet']) : '' }}>
                                </div>
                            </div> :
                            <div className="">
                                <div className="text-gray-200 bg-gray-800 bg-opacity-40 font-mono text-sm sm:text-base md:text-xl shadow-inner">
                                    <textarea onChange={handleOnChangeChordSheet} value={editedChordSheet} className="w-full bg-transparent py-4 px-6 leading-loose" style={{ minHeight: "800px" }}>
                                    </textarea>
                                </div>
                            </div>}

                        <div className="pt-12"></div>

                        <div className="flex flex-wrap px-6">
                            <div className="w-full lg:w-auto">
                                <h4 className="text-gray-400 uppercase text-sm mb-2 text-xs">YouTube Video</h4>
                                {song['YouTube Link'] ?
                                    <div className="bg-gray-800 w-full h-full" style={{ maxWidth: '400px', maxHeight: '225px' }}>
                                        <iframe width="100%" height="225px"
                                            src={`https://www.youtube.com/embed/${getYouTubeID(song['YouTube Link'])}?controls=1&enablejsapi=1`} frameBorder="0"
                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                    </div>
                                    : <></>}
                            </div>
                        </div>

                        <div className="pt-12"></div>
                    </div>
                </> : <div className="text-gray-300 h-screen flex items-center justify-center">Loading...</div>}
        </div>
    );
}

// export async function getStaticProps() {
//     return { props: { } };
// }

const EDIT_MODE = {
    'IDLE': 'IDLE',
    'ACTIVE': 'ACTIVE',
    'ERROR': 'ERROR',
    'SUCCESS': 'SUCCESS'
}

/**
* Get YouTube ID from various YouTube URL
* @author: takien
* @url: http://takien.com
*
* Tested URLs:
var url = 'http://youtube.googleapis.com/v/4e_kz79tjb8?version=3';
url = 'https://www.youtube.com/watch?feature=g-vrec&v=Y1xs_xPb46M';
url = 'http://www.youtube.com/watch?feature=player_embedded&v=Ab25nviakcw#';
url = 'http://youtu.be/Ab25nviakcw';
url = 'http://www.youtube.com/watch?v=Ab25nviakcw';
url = '<iframe width="420" height="315" src="http://www.youtube.com/embed/Ab25nviakcw" frameborder="0" allowfullscreen></iframe>';
url = '<object width="420" height="315"><param name="movie" value="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="420" height="315" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
url = 'http://i1.ytimg.com/vi/Ab25nviakcw/default.jpg';
url = 'https://www.youtube.com/watch?v=BGL22PTIOAM&feature=g-all-xit';
url = 'BGL22PTIOAM';
*/
function getYouTubeID(url) {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    }
    else {
        ID = url;
    }
    return ID;
}