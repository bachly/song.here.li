import React from 'react';
import { IconButton } from "./Buttons";
import { CalendarIcon, ChevronLeftIcon, FolderIcon, MoreHorzIcon, SearchIcon } from "./Icons";
import AppDataContext from '../contexts';
import Link from 'next/link';
import _ from 'underscore';
import { useRouter } from 'next/router';
import clsx from 'clsx';

export function PaneHeader({ title, leftIcon, rightIcon }) {
    return <div className="sidebar__header border-b border-gray-700 border-opacity-50 select-none fixed top-0 w-full" style={{ height: '45px' }}>
        <div className="h-full w-full flex items-center px-1 justify-between select-none text-primary-400">
            <div className="w-12">{leftIcon}</div>
            <span className="text-white font-light text-sm mx-auto">{title}</span>
            <div className="w-12">{rightIcon}</div>
        </div>
    </div>
}

export function Pane({ children, level = 0 }) {
    return <div data-level={level}
        className={`pane absolute z-20 transition ease-in-out transform duration-300 bg-gray-800 bg-opacity-20`}>{children}
    </div>
}

export default function Sidebar({ visibility, currentSong }) {
    const router = useRouter();
    const appData = React.useContext(AppDataContext);
    const searchTerm = React.createRef('');
    const [activeLevel, setActiveLevel] = React.useState(1);

    const activePerformance = React.useRef();
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

        if (activePerformance.current) {
            const performance = activePerformance.current;

            const song1 = performance['Song 1'];
            const song2 = performance['Song 2'];
            const song3 = performance['Song 3'];

            if (song1) {
                songs[song1['id']] = song1;
            }
            if (song1) {
                songs[song2['id']] = song2;
            }
            if (song1) {
                songs[song3['id']] = song3;
            }

            title = performance['Formatted Datetime'];
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
                    if (!!searchTerm.current.value) {
                        if (song['Name'].toLowerCase().indexOf(searchTerm.current.value.toLowerCase()) > -1) {
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

        if (activePerformance.current) {
            console.log(`[SongHere] Performance:`, activePerformance.current);
        }

        setSongs(songs);
        setLevel1Title(title);
    }, [appData, activeGroupName.current, activePerformance.current])

    React.useEffect(() => {
        if (router) {
            const matchedPerformances = appData?.performances?.filter(performance => performance.id === router.query?.performanceId);
            activePerformance.current = matchedPerformances ? matchedPerformances[0] : undefined;
            
            console.log("=== Sdiebar (router, appData): ===", router, appData);
        }
    }, [router, appData])

    function selectGroup(groupName) {
        return event => {
            event && event.preventDefault();
            setActiveLevel(1);
            searchTerm.current.value = '';
            activeGroupName.current = groupName;
            activePerformance.current = null;
        }
    }

    function selectPerformance(performance) {
        return event => {
            event && event.preventDefault();
            setActiveLevel(1);
            searchTerm.current.value = '';
            activePerformance.current = performance;
            activeGroupName.current = null;
        }
    }

    function drillup(event) {
        event && event.preventDefault();
        searchTerm.current.value = '';
        setActiveLevel(0);
    }

    function enterSearchTerm(event) {
        event.preventDefault();
        const term = event.target.value;
        searchTerm.current.value = term;

        if (appData.isLoadingAppData) return;

        activeGroupName.current = null; // reset to no group
        activePerformance.current = null; //reset to no performance
        setLevel1Title('All Songs');

        if (term === '') {
            setSongs(appData.allSongs);
        } else {
            debouncedSearch(term);
        }
    }

    return appData.isLoadingAppData ? <></> :
        <aside>
            <div id="sidebar-content" onClick={event => event && event.stopPropagation()} className={`sidebar ${visibility} lg:block bg-gradient-to-b from-primary-800 to-primary-900 backdrop-blur-sm fixed top-0 z-30 transition ease-in-out duration-300 border-r border-gray-700 border-opacity-50`} data-active-level={activeLevel}>
                <Pane level={0}>
                    <div className="sidebar__header border-b border-gray-700 border-opacity-50 select-none fixed top-0 w-full" style={{ height: '45px' }}>
                        <div id="logo" className="h-full flex items-center pl-4 pt-1 pb-2">
                            <img src="/img/songhere-logo.svg" className="w-8 mr-2" />
                            <span className="text-white font-semibold text-xl">Song</span>
                            <span className="text-white font-thin text-xl">Here</span>
                        </div>
                    </div>

                    <div className="sidebar__inner">
                        <button className="block w-full select-none" onClick={selectGroup(null)}>
                            <div className={`pl-4 w-full block text-left ${!activeGroupName.current && !activePerformance.current ? 'bg-gray-800' : ''} duration-200 transition ease-in-out cursor-default`}>
                                <div className="py-2 border-b border-gray-700 border-opacity-50 flex items-center text-white">
                                    <span className="text-primary-500 fill-current">
                                        <FolderIcon />
                                    </span>
                                    <h3 className="text-lg text-white ml-4 font-light truncate">All Songs</h3>
                                </div>
                            </div>
                        </button>

                        {Object.keys(appData?.songGroups || {}).map(groupName => {
                            return <button className="block w-full select-none" key={`song-group-${groupName}`} onClick={selectGroup(groupName)}>
                                <div className={`pl-4 w-full block text-left ${groupName === activeGroupName.current ? 'bg-gray-800' : ''} active:opacity-80 duration-200 transition ease-in-out cursor-default`}>
                                    <div className="py-2 border-b border-gray-700 border-opacity-50 flex items-center text-white">
                                        <span className="text-primary-500 fill-current">
                                            <FolderIcon />
                                        </span>
                                        <h3 className="text-lg text-white ml-4 font-light truncate">{groupName}</h3>
                                    </div>
                                </div>
                            </button>
                        })}

                        {appData?.performances ? <>
                            <div className="mt-12 mb-4 text-xs text-white tracking-wider uppercase pl-4">Coming Up</div>
                            {appData?.performances.map((performance, index) => {
                                if (index < 6) {
                                    return <button className="block w-full select-none" key={`performance-${performance.id}`} onClick={selectPerformance(performance)}>
                                        <div className={`pl-4 w-full block text-left ${performance === activePerformance.current ? 'bg-gray-800' : ''} active:opacity-80 duration-200 transition ease-in-out cursor-default`}>
                                            <div className="py-2 border-b border-gray-700 border-opacity-50 flex items-center text-white">
                                                <span className="text-primary-500 fill-current">
                                                    <CalendarIcon />
                                                </span>
                                                <h3 className="text-lg text-white ml-4 font-light truncate">{performance['Formatted Datetime']}</h3>
                                            </div>
                                        </div>
                                    </button>
                                } else {
                                    return <div key={`performance-${performance.id}`} />
                                }
                            })}</> : <></>}
                    </div>
                </Pane>
                <Pane level={1}>
                    <PaneHeader
                        title={level1Title}
                        leftIcon={<IconButton onClick={drillup}><ChevronLeftIcon /></IconButton>}
                        rightIcon={``} />
                    <div className="sidebar__inner">
                        <div className="flex items-center bg-gray-800 bg-opacity-20 w-full border-b border-gray-700 border-opacity-50">
                            <div className="text-gray-500 px-2 py-2"><SearchIcon /></div>
                            <input type="text"
                                ref={searchTerm}
                                name="searchTerm"
                                value={searchTerm?.current?.value}
                                onChange={enterSearchTerm}
                                className="appearance-none py-2 text-white w-full bg-gray-800 bg-opacity-20 placeholder-gray-500 focus:outline-none text-white"
                                placeholder="Search" />
                        </div>
                        <div className="">
                            {Object.keys(songs).map(id => {
                                const song = songs[id];

                                if (!song['Name']) return <div key={`song-item-${id}`}></div>;

                                let songHref;

                                if (activePerformance.current) {
                                    songHref = `/app/${id}?performanceId=${activePerformance.current.id}`
                                } else {
                                    songHref = `/app/${id}`;
                                }

                                const isActiveLink = id === currentSong?.id;

                                return <div key={`song-item-${id}`}>
                                    <Link href={songHref}>
                                        <a className={clsx(isActiveLink && 'bg-gray-700 bg-opacity-40', `pl-8 w-full block text-left select-none active:opacity-80 duration-200 transition ease-in-out cursor-default`)}>
                                            <div className="py-2 border-b border-gray-700 border-opacity-50">
                                                <h3 className={clsx(isActiveLink ? 'text-white' : 'text-gray-200', "truncate pr-4")}>{song['Name']}</h3>
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
            <div id="sidebar-overlay" className={clsx(visibility, 'sidebar__overlay lg:hidden bg-black fixed z-10 top-0 left-0 w-screen h-screen bg-opacity-80')}>
            </div>
        </aside>
}

