import React from 'react';
import Airtable from 'airtable';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Toolbar from '../../components/Toolbar';
import PaneLeft from '../../components/PaneLeft';
import SongListWithLinks from '../../page-components/SongListWithLinks';
import { AppDataContext } from '../contexts';
import ChordSheetJS from 'chordsheetjs';
import Video from 'react-player';

const EDIT_MODE = {
    'IDLE': 'IDLE',
    'ACTIVE': 'ACTIVE',
    'ERROR': 'ERROR',
    'SUCCESS': 'SUCCESS'
}

export default function Song() {
    const router = useRouter();
    const [song, setSong] = React.useState(null);
    const [leftPaneState, setLeftPaneState] = React.useState('hidden');
    const appData = React.useContext(AppDataContext);

    const [editedChordSheet, setEditedChordSheet] = React.useState('');
    const [editMode, setEditMode] = React.useState(EDIT_MODE.IDLE);
    const [editMessage, setEditMessage] = React.useState('');
    const parser = new ChordSheetJS.ChordProParser();
    const formatter = new ChordSheetJS.HtmlDivFormatter();

    function toggleLeftPane(event) {
        event && event.preventDefault();
        console.log(leftPaneState ? 'visible' : 'hidden');
        setLeftPaneState(leftPaneState === 'hidden' ? 'visible' : 'hidden');
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

        console.log("song", appData.allSongs[id])

        setSong(appData.allSongs[id]);
        setLeftPaneState('hidden');

    }, [router, appData])

    var base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

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
            console.log(records);

            if (typeof onSongUpdateSuccess === 'function') {
                onSongUpdateSuccess({
                    song: {
                        id: song.id,
                        "Chord Sheet": records[0].get("Chord Sheet")
                    }
                })
            }

            setTimeout(function () {
                setEditMessage('');
                setEditMode(EDIT_MODE.IDLE);
            }, 3000)
        })
    }

    function formatChordSheet(chordProText) {
        const song = parser.parse(chordProText);
        return formatter.format(song);
    }

    return <>
        <Header
            primaryName="Song"
            secondaryName="Here"
            userName="Bach"
        />

        <Toolbar
            toggleLeftPane={toggleLeftPane}
            onStartEditing={startEditing}
            song={song}
        />

        <PaneLeft state={leftPaneState} title="Songs">
            {!appData.loadingAppData ?
                <>
                    <SongListWithLinks songs={appData.allSongs} />
                </> :
                <></>}
        </PaneLeft>

        {song ?
            <div className="w-full max-w-3xl mx-auto relative py-6 px-12">

                <h1 className="relative z-10">
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
                    {editMode === EDIT_MODE.IDLE || editMode === EDIT_MODE.SUCCESS ?
                        <>
                            <div className="text-gray-200 leading-normal text-sm sm:text-base md:text-xl">
                                <div className="chordSheetViewer"
                                    dangerouslySetInnerHTML={{ __html: song['Chord Sheet'] ? formatChordSheet(song['Chord Sheet']) : '' }}>
                                </div>
                            </div>
                        </>
                        :
                        <div className="my-4">
                            <div className="flex items-center">
                                {editMode === EDIT_MODE.IDLE || editMode === EDIT_MODE.SUCCESS ?
                                    <button onClick={startEditing} className="h-8 text-white fill-current p-1 px-3 hover:bg-teal-900 rounded-lg bg-gray-700 hover:bg-gray-600 duration-100 transition">
                                        Edit
                                    </button>
                                    : <>
                                        <button onClick={cancelEditing} className="h-8 text-white text-sm p-1 px-3 rounded-lg bg-gray-700 hover:bg-gray-600 mr-2 duration-100 transition">Cancel</button>
                                        <button onClick={saveEditing} className="h-8 text-white text-sm p-1 px-3 rounded-lg bg-teal-900 hover:bg-teal-800 duration-100 transition">Save</button>
                                    </>}
                                <div className="text-white text-sm">
                                    {editMode === EDIT_MODE.SUCCESS ?
                                        <div className="text-teal-500 ml-2">{editMessage}</div> : <></>}

                                    {editMode === EDIT_MODE.ERROR ?
                                        <div className="text-red-400 ml-2">{editMessage}</div> : <></>}
                                </div>
                            </div>
                            <textarea onChange={handleOnChangeChordSheet} value={editedChordSheet}
                                className="mt-6 w-full text-gray-200 bg-gray-900 bg-opacity-50 font-mono text-sm sm:text-base md:text-xl py-4 leading-loose shadow-inner focus:outline-none focus:ring focus:ring-teal-800 rounded-xl" style={{ minHeight: "calc(60vh)" }}>
                            </textarea>
                        </div>}
                </div>

                <div className="pt-24"></div>
            </div> :
            <div className="text-gray-300 flex items-center justify-center" style={{ height: '50vh' }}>Loading...</div>
        }
    </>
}