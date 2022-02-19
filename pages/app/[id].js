import React from 'react';
import { useRouter } from 'next/router';
import Toolbar from '../../components/Toolbar';
import Sidebar from '../../components/Sidebar';
import { AppDataContext } from '../../contexts';
import ChordSheetJS from 'chordsheetjs';
import { AsyncButton, Button } from '../../components/Buttons';
import Spinner from '../../components/Spinner';
import { Chord } from 'chordsheetjs';
import SongDisplay from '../../components/SongDisplay';

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
            {showSpinner() ? //
                <div className="w-screen h-screen flex items-center justify-center">
                    <Spinner />
                </div> : <></>}
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

                <SongDisplay song={song} errorParsingSong={alerts && alerts['ERROR_PARSING_CHORD_SHEET']?.active} />

                {/* Song Edit Modal */}
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
            </>
        }
    </>
}