import React from 'react';
import { IconButton } from "./Buttons";
import { CalendarIcon, ChevronLeftIcon, FolderIcon, MoreHorzIcon, SearchIcon } from "./Icons";
import AppDataContext from '../contexts';
import Link from 'next/link';
import _ from 'underscore';
import { useRouter } from 'next/router';

export function PaneHeader({ title, leftIcon, rightIcon }) {
    return <div className="border-b border-gray-700 border-opacity-50 select-none" style={{ height: '45px' }}>
        <div className="h-full flex items-center px-1 justify-between select-none text-primary-400">
            {leftIcon}
            <span className="text-white font-light text-sm">{title}</span>
            {rightIcon}
        </div>
    </div>
}

export function Pane({ children, level = 0 }) {
    return <div data-level={level}
        className={`pane absolute transition ease-in-out transform duration-200 bg-gray-800 bg-opacity-20 border-r border-gray-700 border-opacity-50`}>{children}
    </div>
}

export default function Sidebar({ visibility, currentSong }) {
    const router = useRouter();
    const appData = React.useContext(AppDataContext);
    const [searchTerm, setSearchTerm] = React.useState();
    const [activeLevel, setActiveLevel] = React.useState(1);

    const activeSchedule = React.useRef();
    const activeGroupName = React.useRef();
    const [level1Title, setLevel1Title] = React.useState('');
    const [songs, setSongs] = React.useState({});

    const debouncedSearch = React.useRef(_.debounce((term) => {
        const songs = {};
        console.log(`Search "${term}"`);

        Object.keys(appData.allSongs).map(id => {
            const song = appData.allSongs[id];
            if (song['Name'].toLowerCase().indexOf(term.toLowerCase()) > -1) {
                songs[id] = song;
            }
        })

        console.log(`Found songs:`, songs);
        setSongs(songs);
    }, 500)).current;

    React.useEffect(function whenGroupSelected() {
        if (appData.isLoadingAppData) return;

        let songs = {};
        let title = '';

        if (activeSchedule.current) {
            const schedule = activeSchedule.current;

            const song1 = schedule['Song 1'];
            const song2 = schedule['Song 2'];
            const song3 = schedule['Song 3'];

            if (song1) {
                songs[song1['id']] = song1;
            }
            if (song1) {
                songs[song2['id']] = song2;
            }
            if (song1) {
                songs[song3['id']] = song3;
            }

            title = schedule['Formatted Datetime'];
        } else {
            if (activeGroupName.current) {
                Object.keys(appData.allSongs).map(id => {
                    const song = appData.allSongs[id];
                    if (song['Group'] === activeGroupName.current) {
                        songs[id] = song;
                    }
                })
                title = activeGroupName.current;
            } else {
                Object.keys(appData.allSongs).map(id => {
                    const song = appData.allSongs[id];
                    if (!!searchTerm) {
                        if (song['Name'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                            songs[id] = song;
                        }
                    } else {
                        songs[id] = song;
                    }
                })

                title = 'All Songs';
            }
        }

        console.log(`[SongHere] Song list "${title}":`, songs);

        if (activeSchedule.current) {
            console.log(`[SongHere] Schedule:`, activeSchedule.current);
        }

        setSongs(songs);
        setLevel1Title(title);
    }, [appData, activeGroupName.current, activeSchedule.current])

    React.useEffect(() => {
        if (router) {
            const matchedSchedules = appData?.schedules?.filter(schedule => schedule.id === router.query?.scheduleId);
            activeSchedule.current = matchedSchedules ? matchedSchedules[0] : undefined;
            console.log('currentSchedule', activeSchedule.current);
        }
    }, [router, appData])

    function selectGroup(groupName) {
        return event => {
            event && event.preventDefault();
            setActiveLevel(1);
            setSearchTerm('');
            activeGroupName.current = groupName;
            activeSchedule.current = null;
        }
    }

    function selectSchedule(schedule) {
        return event => {
            event && event.preventDefault();
            setActiveLevel(1);
            setSearchTerm('');
            activeSchedule.current = schedule;
            activeGroupName.current = null;
        }
    }

    function drillup(event) {
        event && event.preventDefault();
        setSearchTerm('');
        setActiveLevel(0);
    }

    function enterSearchTerm(event) {
        event.preventDefault();
        const term = event.target.value;
        setSearchTerm(term);

        if (appData.isLoadingAppData) return;

        activeGroupName.current = null; // reset to no group
        activeSchedule.current = null; //reset to no schedule
        setLevel1Title('All Songs');

        if (term === '') {
            setSongs(appData.allSongs);
        } else {
            debouncedSearch(term);
        }
    }

    return appData.isLoadingAppData ? <></> :
        <div onClick={event => event && event.stopPropagation()} className={`sidebar ${visibility} lg:block bg-gray-900 fixed top-0 z-20 transition ease-in-out duration-200`} data-active-level={activeLevel}>
            <Pane level={0}>
                <div className="sidebar__inner">
                    <div id="logo" className="flex items-center select-none pl-4 pt-1 pb-2 border-b border-gray-700 border-opacity-50">
                        <span className="text-primary-400 font-semibold text-xl">Song</span>
                        <span className="text-white font-light text-xl">Here</span>
                    </div>

                    <button className="block w-full select-none" onClick={selectGroup(null)}>
                        <div className={`pl-4 w-full block text-left ${!activeGroupName.current && !activeSchedule.current ? 'bg-gray-800' : 'hover:bg-gray-800 hover:bg-opacity-50'} duration-200 transition ease-in-out cursor-default`}>
                            <div className="py-2 border-b border-gray-700 border-opacity-50 flex items-center text-white">
                                <FolderIcon />
                                <h3 className="text-lg text-white ml-4 font-light truncate">All Songs</h3>
                            </div>
                        </div>
                    </button>

                    {Object.keys(appData?.songGroups || {}).map(groupName => {
                        return <button className="block w-full select-none" key={`song-group-${groupName}`} onClick={selectGroup(groupName)}>
                            <div className={`pl-4 w-full block text-left ${groupName === activeGroupName.current ? 'bg-gray-800' : 'hover:bg-gray-800 hover:bg-opacity-50'} active:opacity-80 duration-200 transition ease-in-out cursor-pointer`}>
                                <div className="py-2 border-b border-gray-700 border-opacity-50 flex items-center text-white">
                                    <FolderIcon />
                                    <h3 className="text-lg text-white ml-4 font-light truncate">{groupName}</h3>
                                </div>
                            </div>
                        </button>
                    })}

                    {appData?.schedules ? <>
                        <div className="mt-12 mb-4 text-xs text-white tracking-wider uppercase pl-4">Coming Up</div>
                        {appData?.schedules.map((schedule, index) => {
                            if (index < 6) {
                                return <button className="block w-full select-none" key={`schedule-${schedule.id}`} onClick={selectSchedule(schedule)}>
                                    <div className={`pl-4 w-full block text-left ${schedule === activeSchedule.current ? 'bg-gray-800' : 'hover:bg-gray-800 hover:bg-opacity-50'} active:opacity-80 duration-200 transition ease-in-out cursor-pointer`}>
                                        <div className="py-2 border-b border-gray-700 border-opacity-50 flex items-center text-white">
                                            <CalendarIcon />
                                            <h3 className="text-lg text-white ml-4 font-light truncate">{schedule['Formatted Datetime']}</h3>
                                        </div>
                                    </div>
                                </button>
                            } else {
                                return <div key={`schedule-${schedule.id}`} />
                            }
                        })}</> : <></>}
                </div>
            </Pane>
            <Pane level={1}>
                <PaneHeader
                    title={level1Title}
                    leftIcon={<IconButton onClick={drillup}><ChevronLeftIcon /></IconButton>}
                    rightIcon={<IconButton><MoreHorzIcon /></IconButton>} />
                <div className="sidebar__inner">
                    <div className="flex items-center bg-gray-800 bg-opacity-20 w-full border-b border-gray-700 border-opacity-50">
                        <div className="text-gray-500 px-2 py-2"><SearchIcon /></div>
                        <input type="text"
                            name="searchTerm"
                            value={searchTerm}
                            onChange={enterSearchTerm}
                            className="appearance-none py-2 text-white w-full bg-gray-800 bg-opacity-20 placeholder-gray-500 focus:outline-none text-white"
                            placeholder="Search" />
                    </div>
                    <div className="">
                        {Object.keys(songs).map(id => {
                            const song = songs[id];

                            if (!song['Name']) return <div key={`song-item-${id}`}></div>;

                            let songHref = `/${id}`;

                            if (activeSchedule.current) {
                                songHref = `${songHref}?scheduleId=${activeSchedule.current.id}`
                            }

                            return <div key={`song-item-${id}`}>
                                <Link href={songHref}>
                                    <a className={`pl-8 w-full block text-left select-none ${id === currentSong?.id ? 'bg-gray-800' : 'hover:bg-gray-800 hover:bg-opacity-50'} active:opacity-80 duration-200 transition ease-in-out cursor-default`}>
                                        <div className="py-2 border-b border-gray-700 border-opacity-50">
                                            <h3 className="text-white">{song['Name']}</h3>
                                            <div className="mr-2">
                                                {song['Author/Singer'] ?
                                                    <span className="text-gray-400 text-sm">{song['Author/Singer']}</span>
                                                    : <span className="text-gray-400 text-sm">Unknown</span>}
                                                {song['Key'] ?
                                                    <span className="text-sm text-primary-400 ml-2">
                                                        {song['Key']}
                                                    </span>
                                                    : <></>}
                                            </div>
                                        </div>
                                    </a>
                                </Link>
                            </div>
                        })}
                    </div>
                </div>
            </Pane>
        </div>
}

