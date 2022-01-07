import React from 'react';
import Airtable from 'airtable';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Toolbar from '../../components/Toolbar';
import Sidebar from '../../components/Sidebar';
import { AppDataContext } from '../../contexts';
import ChordSheetJS from 'chordsheetjs';
import Video from 'react-player';
import { CheckIcon } from '../../components/Icons';
import { AsyncButton } from '../../components/Buttons';

const EDIT_MODE = {
    'IDLE': 'IDLE',
    'ACTIVE': 'ACTIVE',
    'ERROR': 'ERROR',
    'SUCCESS': 'SUCCESS',
    'SAVING': 'SAVING'
}

export default function Song() {
    const router = useRouter();
    const [song, setSong] = React.useState(null);
    const [sidebarState, setSidebarState] = React.useState('hidden');
    const appData = React.useContext(AppDataContext);
    const [editedChordSheet, setEditedChordSheet] = React.useState('');
    const [editMode, setEditMode] = React.useState(EDIT_MODE.IDLE);
    const parser = new ChordSheetJS.ChordProParser();
    const formatter = new ChordSheetJS.HtmlDivFormatter();
    const textareaRef = React.useRef();

    function toggleSidebar(event) {
        event && event.preventDefault();
        setSidebarState(sidebarState === 'hidden' ? 'block' : 'hidden');
    }

    React.useEffect(() => {
        if (!router || appData.loadingAppData) return;

        const { id } = router.query;

        if (!id) return;

        // const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

        // base('Song List').find(id, (err, record) => {
        //     const song = {
        //         id: id,
        //         'Name': record.get('Name') || null,
        //         'Ready': record.get('Ready') || null,
        //         'Group': record.get('Group') || null,
        //         'Key': record.get('c') || null,
        //         'BPM': record.get('BPM') || null,
        //         'Key': record.get('Key') || null,
        //         'Chord Sheet': record.get('Chord Sheet') || null,
        //         'YouTube Link': record.get('YouTube Link') || null,
        //         'Author/Singer': record.get('Author/Singer') || null,
        //     }

        //     setSong(song);
        //     setLeftPaneState('hidden');
        // });

        console.log("song loaded:", appData.allSongs[id]);

        setSong(appData.allSongs[id]);
        setSidebarState('hidden');
    }, [router, appData])

    var base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

    function cancelEditing(event) {
        event.preventDefault();
        setEditMode(EDIT_MODE.IDLE)

        // stop <body> from scrolling
        document.getElementsByTagName('body')[0].classList = ""
    }

    function startEditing(event) {
        event.preventDefault();
        setEditMode(EDIT_MODE.ACTIVE);
        setEditedChordSheet(song['Chord Sheet'] ? song['Chord Sheet'] : '')

        // // adjust textarea height to fit content
        // const scrollHeight = textareaRef?.current.height;
        // textareaRef.current.style.height = `${scrollHeight}px`;

        // stop <body> from scrolling
        document.getElementsByTagName('body')[0].classList = "overflow-hidden"
    }

    function handleOnChangeChordSheet(event) {
        setEditedChordSheet(event.target.value)
    }

    function saveEditing(event) {
        event.preventDefault();

        setEditMode(EDIT_MODE.SAVING);

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
                console.error(err);
                alert(err);
                return;
            }

            setEditMode(EDIT_MODE.SUCCESS);
            console.log('Song saved:', {
                id: records[0].id,
                ...records[0].fields
            });

            if (typeof onSongUpdateSuccess === 'function') {
                onSongUpdateSuccess({
                    song: {
                        id: song.id,
                        "Chord Sheet": records[0].get("Chord Sheet")
                    }
                })
            }

            setTimeout(function () {
                setEditMode(EDIT_MODE.IDLE);

                // stop <body> rom scrolling
                document.getElementsByTagName('body')[0].classList = ""
            }, 700)
        })
    }

    function formatChordSheet(chordProText) {
        const song = parser.parse(chordProText);
        return formatter.format(song);
    }

    function textAreaAdjust(event) {
        console.log(event);
        const scrollHeight = event.target.scrollHeight;
        console.log(scrollHeight);
        event.target.style.height = `${scrollHeight}px`;
    }

    return <>
        <Header
            primaryName="Song"
            secondaryName="Here"
        />

        <Toolbar
            toggleLeftPane={toggleSidebar}
            onStartEditing={startEditing}
            currentSong={song}
        />

        <Sidebar state={sidebarState} currentSong={song} />

        <div className="pt-24 mainbar">
            {!song ?
                <div className="text-gray-300 flex items-center justify-center" style={{ height: '50vh' }}>Loading...</div>
                :
                <div className="w-full max-w-3xl mx-auto relative py-6 px-12">

                    <h1 className="">
                        <div className="text-white text-left text-lg sm:text-2xl md:text-3xl">
                            <span className="font-bold">{song['Name']}</span>
                        </div>
                        <div className="flex items-center">
                            <div className="text-left text-gray-300 text-sm md:text-base font-regular opacity-60">
                                {song['Author/Singer']}
                            </div>
                        </div>
                    </h1>

                    <style>
                        {ChordSheetJS.HtmlDivFormatter.cssString('.chordSheetViewer')}
                        {`
                        .chord { color: rgb(45, 212, 191) }
                        .chordSheetViewer .column {
                        }
                        .chordSheetViewer .row {
                            flex-wrap: wrap;
                            line-height: 1;
                        }
                        .chordSheetViewer .chord {
                            line-height: 1.25;
                        }
                        .chordSheetViewer .lyrics:after {
                            content: ' ';
                            display: inline-block;
                        }

                        .chordSheetViewer .comment {
                            font-weight: bold;
                            margin: 2rem 0;
                        }
                        `}
                    </style>

                    <div className="mt-6 mx-auto">
                        <div className={editMode === EDIT_MODE.IDLE ? 'block' : 'hidden'}>
                            <div className="text-gray-200 leading-normal text-sm sm:text-base md:text-xl">
                                <div className="chordSheetViewer"
                                    dangerouslySetInnerHTML={{ __html: song['Chord Sheet'] ? formatChordSheet(song['Chord Sheet']) : '' }}>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20"></div>

                    {/* Edit Modal */}
                    <div className={`${editMode === EDIT_MODE.IDLE ? 'edit-modal--hidden' : 'edit-modal--block bg-gray-900'} fixed z-50 left-0 top-0 w-screen h-screen duration-200 transition`}>
                        <div className="border-b border-gray-700 border-opacity-50" style={{ height: '45px' }}>
                            <div className="h-full flex items-center justify-between px-4">
                                <button onClick={cancelEditing} className="text-white text-opacity-50 text-xl py-1 px-2 rounded-md hover:bg-gray-800 hover:text-opacity-100 active:scale-95 duration-100 transition">Cancel</button>
                                <div className="text-white text-center flex-1 text-xl w-24">
                                    Edit {song['Name']}
                                </div>
                                <AsyncButton loading={editMode === EDIT_MODE.SAVING} success={editMode === EDIT_MODE.SUCCESS} onClick={saveEditing}>
                                    Save
                                </AsyncButton>
                            </div>
                        </div>
                        <div className="">
                            {/* <div className="border-b border-gray-700 border-opacity-50" style={{ height: '45px' }}>
                                <div className="h-full flex items-center px-4">
                                    <input type="text" defaultValue={song['Name']} className="text-xl text-white bg-transparent mr-2 focus:outline-none" />
                                    <input type="text" defaultValue={song['Author/Singer']} className="text-xl text-white bg-transparent focus:outline-none" />
                                </div>
                            </div> */}
                            <textarea ref={textareaRef} onChange={handleOnChangeChordSheet} value={editedChordSheet}
                                style={{ height: 'calc(100vh - 45px)', paddingBottom: '70px' }}
                                className="w-full text-gray-200 bg-gray-800 bg-opacity-50 font-mono text-sm sm:text-base md:text-xl p-4 leading-loose shadow-inner focus:outline-none rounded-xl">
                            </textarea>
                        </div>
                    </div>
                </div>
            }
        </div>
    </>
}