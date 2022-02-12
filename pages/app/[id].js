import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Toolbar from '../../components/Toolbar';
import Sidebar from '../../components/Sidebar';
import { AppDataContext } from '../../contexts';
import ChordSheetJS from 'chordsheetjs';
import Video from 'react-player';
import { AsyncButton, Button } from '../../components/Buttons';
import Spinner from '../../components/Spinner';
import { Chord } from 'chordsheetjs';

const EDIT_MODE = {
    'IDLE': 'IDLE',
    'ACTIVE': 'ACTIVE',
    'SUCCESS': 'SUCCESS',
    'SAVING': 'SAVING'
}

const ALERTS = {
    ERROR_PARSING_CHORD_SHEET: {
        active: false,
        message: "Error parsing your Chord Sheet. Please use supported ChordPro format."
    }
}

export default function Song() {
    const router = useRouter();
    const [song, setSong] = React.useState(null);
    const [sidebarState, setSidebarState] = React.useState('hidden');
    const appDataContext = React.useContext(AppDataContext);
    const [editedChordSheet, setEditedChordSheet] = React.useState('');
    const [editMode, setEditMode] = React.useState(EDIT_MODE.IDLE);
    const [currentTranpose, setCurrentTranspose] = React.useState(0);
    const parser = new ChordSheetJS.ChordProParser();
    const [alerts, setAlerts] = React.useState(ALERTS);

    function toggleSidebar(event) {
        event && event.preventDefault();
        event && event.stopPropagation();

        const newState = sidebarState === 'hidden' ? 'block' : 'hidden';
        setSidebarState(newState);

        if (newState === 'block') {
            $(window).one('click', () => {
                setSidebarState('hidden');
            })
        }
    }

    function toggleAlert(name, active) {
        setAlerts({
            ...alerts,
            [name]: {
                ...ALERTS[name],
                active
            }
        })
    }

    React.useEffect(() => {
        if (!router || appDataContext.loadingAppData) return;
        const { id } = router.query;
        if (!id) return;

        const currentSong = appDataContext.allSongs[id];
        let chordSheetJsSong, currentSongWithChordSheetJS;

        try {

            if (currentSong['Chord Sheet'] === '') {
                currentSongWithChordSheetJS = {
                    ...currentSong,
                    'Chord Sheet JS Song': null
                }
            } else {
                chordSheetJsSong = currentSong ? parser.parse(currentSong['Chord Sheet']) : null;
                currentSongWithChordSheetJS = {
                    ...currentSong,
                    'Chord Sheet JS Song': {
                        _original: chordSheetJsSong,
                        artist: chordSheetJsSong ? chordSheetJsSong.metadata?.artist : '',
                        key: chordSheetJsSong ? chordSheetJsSong.metadata?.key : '',
                        paragraphs: chordSheetJsSong ? JSON.parse(JSON.stringify(chordSheetJsSong.paragraphs)) : []
                    }
                }
            }
            toggleAlert('ERROR_PARSING_CHORD_SHEET', false);
        } catch (error) {
            console.warn("ERROR_PARSING_CHORD_SHEET", error);
            currentSongWithChordSheetJS = {
                ...currentSong,
                'Chord Sheet JS Song': null
            }

            toggleAlert('ERROR_PARSING_CHORD_SHEET', true);
        } finally {
            setSong(currentSongWithChordSheetJS);
            setSidebarState('hidden');
        }
    }, [router, appDataContext])

    function cancelEditing(event) {
        event.preventDefault();
        setEditMode(EDIT_MODE.IDLE)

        document.getElementsByTagName('body')[0].classList = "" // stop <body> from scrolling
    }

    function startEditing(event) {
        event.preventDefault();
        setEditMode(EDIT_MODE.ACTIVE);
        setEditedChordSheet(song['Chord Sheet'] ? song['Chord Sheet'] : '')

        document.getElementsByTagName('body')[0].classList = "overflow-hidden" // stop <body> from scrolling
    }

    function handleOnChangeChordSheet(event) {
        setEditedChordSheet(event.target.value)
    }

    function saveEditing(event) {
        event.preventDefault();

        setEditMode(EDIT_MODE.SAVING);
        document.getElementsByTagName('body')[0].classList = ""  // stop <body> rom scrolling

        appDataContext.updateSong({
            song: {
                id: song.id,
                'Chord Sheet': editedChordSheet
            },
            onSuccess: () => {
                setEditMode(EDIT_MODE.IDLE);
            }
        })
    }

    function showSpinner() {
        return appDataContext.isLoadingAppData || !song || editMode === EDIT_MODE.SAVING
    }

    function tranposeSong(semitones) {
        return (event) => {
            event && event.preventDefault();
            const newTranspose = currentTranpose + semitones;
            setCurrentTranspose(newTranspose);

            const newParagraphs = song['Chord Sheet JS Song']?.paragraphs?.map(paragraph => {
                return {
                    ...paragraph,
                    lines: paragraph?.lines?.map(line => {
                        return {
                            ...line,
                            items: line.items.map(item => {
                                return {
                                    ...item,
                                    chords: (() => {
                                        if (!!item.chords) {
                                            const chords = Chord.parse(item.chords);
                                            const newChords = chords.transpose(newTranspose);
                                            return newChords.toString()
                                        } else {
                                            return item.chords;
                                        }
                                    })()
                                }
                            })
                        }
                    })
                }
            })

            setSong({
                ...song,
                'Chord Sheet JS Song': {
                    ...song['Chord Sheet JS Song'],
                    paragraphs: newParagraphs
                }
            })
        }
    }

    return <>
        {!song ? <>
            {showSpinner() ? <div className="w-screen h-screen flex items-center justify-center"><Spinner /></div> : <></>}
        </> :
            <>
                <Toolbar
                    toggleLeftPane={toggleSidebar}
                    onStartEditing={startEditing}
                    currentSong={song}
                    loading={showSpinner()}
                    currentTranpose={currentTranpose}
                    onTranspose={tranposeSong}
                    alerts={alerts}
                />

                <Sidebar visibility={sidebarState} currentSong={song} />

                <div className="mainbar pb-24" style={{ marginTop: '45px' }}>
                    <div className="w-full relative p-4 md:p-12">

                        <h1 id="songName">
                            <div className="text-white text-left text-2xl md:text-3xl font-light leading-tight">
                                {song['Name']}
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="text-left text-gray-300 text-sm md:text-base font-regular opacity-60">
                                    {song['Author/Singer']}
                                </div>
                            </div>
                        </h1>

                        {song['Audio Filename'] ?
                            <div className="mt-12 py-4 px-6 bg-black rounded-xl">
                                <span className="text-white text-opacity-60">{song['Audio Filename']}</span>
                                <audio className="mt-2 w-full" controls src={`/audio/${song['Audio Filename']}`} title={`${song['Name']}`} type="audio/mpeg/">
                                    Your browser does not support the
                                    <code>audio</code> element.
                                </audio>
                            </div> : <></>}

                        <div className="mt-6 mx-auto">
                            <div className="text-gray-200 leading-normal text-sm sm:text-base md:text-lg">
                                {alerts && alerts['ERROR_PARSING_CHORD_SHEET']?.active ?
                                    <>
                                        {song['Chord Sheet']}
                                    </> :
                                    <ChordSheetJsSongDisplay chordSheetJsSong={song['Chord Sheet JS Song']} />
                                }
                            </div>
                        </div>

                        {/* Edit Modal */}
                        <div className={`${editMode === EDIT_MODE.ACTIVE ? 'edit-modal--block' : 'edit-modal--hidden'} bg-gray-900 fixed z-30 left-0 top-0 w-screen h-screen duration-200 transition`}>
                            <div className="mx-auto">
                                <div className="border-b border-gray-700 border-opacity-50 bg-gray-800 bg-opacity-80 fixed top-0 w-full" style={{ height: '45px' }}>
                                    <div className="h-full flex items-center justify-between">
                                        <Button onClick={cancelEditing}>Cancel</Button>
                                        <div className="text-gray-400 text-center flex-1 text-sm truncate mx-4">
                                            {song['Name']}
                                        </div>
                                        <AsyncButton loading={editMode === EDIT_MODE.SAVING} success={editMode === EDIT_MODE.SUCCESS} onClick={saveEditing}>
                                            Save
                                        </AsyncButton>
                                    </div>
                                </div>
                                <div className="mx-auto" style={{ marginTop: '45px' }}>
                                    <textarea onChange={handleOnChangeChordSheet} value={editedChordSheet}
                                        style={{ height: 'calc(100vh - 45px)', paddingBottom: '70px' }}
                                        className="bg-gray-900 w-full text-gray-200 leading-normal text-sm sm:text-base md:text-lg font-mono py-3 px-2 lg:px-6 shadow-inner focus:outline-none">
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-4 md:p-12 border-t border-gray-800">
                        <div className="flex justify-start">
                            <div className="block md:hidden">
                                <Video url={song['YouTube Link']} light={true}
                                    width="280px" height="168.75px" controls={true} />
                            </div>
                            <div className="hidden md:block">
                                <Video url={song['YouTube Link']} light={true}
                                    width="500px" height="281.25px" controls={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }
    </>
}

function ChordSheetJsSongDisplay({ chordSheetJsSong }) {
    if (!chordSheetJsSong) return <></>;

    if (chordSheetJsSong.paragraphs) {
        console.log("[SongHere] ChordSheetJsSong:", chordSheetJsSong);
        return chordSheetJsSong?.paragraphs?.map((paragraph, index) => {
            return <Paragraph key={`paragarph-${index}`} paragraph={paragraph} />
        })
    } else {
        console.log("[SongHere] ChordSheetJsSong: empty");
        return <></>
    }
}

function Paragraph({ paragraph }) {
    return <div className="chordSheetParagraph mt-16">{paragraph.lines.map((line, index) => {
        return <Line key={`line-${index}`} line={line} />
    })}</div>
}

function Line({ line }) {
    const item = line.items[0];

    switch (item._name) {
        case 'comment':
            return <div className={`ChordSongComment text-primary-400 font-bold mb-4 text-base uppercase tracking-wide`}>{item._value}</div>;
        default:
            return <ChordLyricsLine items={line.items} />
    }
}

function ChordLyricsLine({ items }) {
    return <div className="flex flex-wrap items-center mb-2">
        {items.map((item, index) => {
            return <div key={index}>
                <div className="h-6 text-primary-400">
                    {item['chords']}
                    {lyricsItemIsEmpty(item['lyrics']) ? <>&nbsp;&nbsp;</> : <></>}
                </div>
                <div className="h-6 text-base sm:text-lg md:text-xl lg:text-2xl font-regular">
                    {lyricsItemDisplay(item['lyrics'])}
                </div>
            </div>
        })}
    </div>
}

function lyricsItemIsEmpty(item) {
    return !item || item === ' ' || item === '';
}

function lyricsItemEndsWithSpace(item) {
    return item && item[item.length - 1] === ' '
}

function lyricsItemStartsWithSpace(item) {
    return item && item[0] === ' '
}

function lyricsItemDisplay(item) {
    if (!item) return;

    let display = [];

    if (lyricsItemEndsWithSpace(item)) {
        display[2] = <>&nbsp;</>;
    }

    if (lyricsItemStartsWithSpace(item)) {
        display[0] = <>&nbsp;&nbsp;&nbsp;&nbsp;</>;
    }

    display[1] = <>{item.trim()}</>;

    return display.map((d, index) => <span key={index}>{d}</span>);
}