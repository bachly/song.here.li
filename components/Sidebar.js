import React from 'react';
import { IconButton } from "./Buttons";
import { ChevronLeftIcon, MoreHorzIcon, SearchIcon } from "./Icons";
import AppDataContext from '../contexts';
import Link from 'next/link';
import _ from 'underscore';

export function PaneHeader({ title, leftIcon, rightIcon }) {
    return <div className="border-b border-gray-700 border-opacity-50 select-none" style={{ height: '45px' }}>
        <div className="h-full flex items-center px-3 justify-between select-none text-primary-400">
            {leftIcon}
            <span className="text-gray-300 font-light text-xl">{title}</span>
            {rightIcon}
        </div>
    </div>
}

export function Pane({ children, level = 0 }) {
    return <div data-level={level}
        className={`pane absolute transition ease-in-out transform duration-200 bg-gray-800 bg-opacity-20 border-r border-gray-700 border-opacity-50`}>{children}
    </div>
}

export default function Sidebar({ state, currentSong }) {
    const [songs, setSongs] = React.useState({});
    const [activeLevel, setActiveLevel] = React.useState(1);
    const appData = React.useContext(AppDataContext);

    const activeGroupName = React.useRef(currentSong['Group']);
    const [searchTerm, setSearchTerm] = React.useState();

    const debouncedSearch = React.useRef(_.debounce((term) => {
        const songs = {};
        console.log('Perform search', term);

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

        if (activeGroupName.current) {
            Object.keys(appData.allSongs).map(id => {
                const song = appData.allSongs[id];
                if (song['Group'] === activeGroupName.current) {
                    songs[id] = song;
                }
            })
        } else {
            songs = appData.allSongs;
        }

        console.log(`songs under group:`, songs);
        setSongs(songs);
    }, [appData, activeGroupName.current])

    function selectGroup(groupName) {
        return event => {
            event && event.preventDefault();
            setActiveLevel(activeLevel + 1);
            activeGroupName.current = groupName;
        }
    }

    function drillup(event) {
        event && event.preventDefault();
        setActiveLevel(activeLevel <= 0 ? 0 : activeLevel - 1);
    }

    function enterSearchTerm(event) {
        event.preventDefault();
        const term = event.target.value;
        setSearchTerm(term);

        if (appData.isLoadingAppData) return;

        activeGroupName.current = null; // reset to no group

        if (term === '') {
            setSongs(appData.allSongs);
        } else {
            debouncedSearch(term);
        }
    }

    return appData.isLoadingAppData ? <></> :
        <div onClick={event => event && event.stopPropagation()} className={`sidebar ${state} lg:block bg-gray-900 fixed z-20 transition ease-in-out duration-200`} data-active-level={activeLevel}>
            <Pane level={0}>
                <button className="block w-full select-none" onClick={selectGroup(null)}>
                    <div className={`pl-8 w-full block text-left ${!activeGroupName.current ? 'bg-gray-800' : 'hover:bg-gray-800 hover:bg-opacity-50'} duration-200 transition ease-in-out cursor-pointer`}>
                        <div className="py-3 border-b border-gray-700 border-opacity-50">
                            <h3 className="text-md text-white">All Songs</h3>
                        </div>
                    </div>
                </button>
                <div className="sidebar__inner">
                    <div className="text-white">
                        {Object.keys(appData?.songGroups || {}).map(groupName => {
                            return <button className="block w-full select-none" key={`song-group-${groupName}`} onClick={selectGroup(groupName)}>
                                <div className={`pl-8 w-full block text-left ${groupName === activeGroupName.current ? 'bg-gray-800' : 'hover:bg-gray-800 hover:bg-opacity-50'} active:opacity-80 duration-200 transition ease-in-out cursor-pointer`}>
                                    <div className="py-3 border-b border-gray-700 border-opacity-50">
                                        <h3 className="text-md text-white">{groupName}</h3>
                                    </div>
                                </div>
                            </button>
                        })}
                    </div>
                </div>
            </Pane>
            <Pane level={1}>
                <PaneHeader
                    title={activeGroupName.current || 'All songs'}
                    leftIcon={<IconButton onClick={drillup}><ChevronLeftIcon /></IconButton>}
                    rightIcon={<IconButton><MoreHorzIcon /></IconButton>} />
                <div className="sidebar__inner">
                    <div className="flex items-center">
                        <div className="text-gray-500 px-2 py-3"><SearchIcon /></div>
                        <input type="search"
                            defaultValue={searchTerm}
                            onChange={enterSearchTerm}
                            className="py-3 text-whitew w-full bg-gray-900 border-b border-gray-700 border-opacity-50 placeholder-gray-500 focus:outline-none text-white" placeholder="Search" />
                    </div>
                    <div className="">
                        {Object.keys(songs).map(id => {
                            const song = songs[id];

                            if (!song['Name']) return <div key={`song-item-${id}`}></div>;

                            return <div key={`song-item-${id}`}>
                                <Link href={`/song/${id}`}>
                                    <a className={`pl-8 w-full block text-left select-none ${id === currentSong?.id ? 'bg-gray-800' : 'hover:bg-gray-800 hover:bg-opacity-50'} active:opacity-80 duration-200 transition ease-in-out cursor-pointer`}>
                                        <div className="py-3 border-b border-gray-700 border-opacity-50">
                                            <h3 className="font-bold text-md text-white">{song['Name']}</h3>
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

