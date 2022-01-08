import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Toolbar from '../../components/Toolbar';
import Sidebar from '../../components/Sidebar';
import { AppDataContext } from '../../contexts';
import ChordSheetJS from 'chordsheetjs';
import Video from 'react-player';
import { AsyncButton, Button } from '../../components/Buttons';

const EDIT_MODE = {
    'IDLE': 'IDLE',
    'ACTIVE': 'ACTIVE',
    'SUCCESS': 'SUCCESS',
    'SAVING': 'SAVING'
}

export default function Song() {
    const router = useRouter();
    const [song, setSong] = React.useState(null);
    const [sidebarState, setSidebarState] = React.useState('hidden');
    const appDataContext = React.useContext(AppDataContext);
    const [editedChordSheet, setEditedChordSheet] = React.useState('');
    const [editMode, setEditMode] = React.useState(EDIT_MODE.IDLE);
    const parser = new ChordSheetJS.ChordProParser();
    const formatter = new ChordSheetJS.HtmlDivFormatter();
    const textFormatter = new ChordSheetJS.TextFormatter();
    const chordProFormatter = new ChordSheetJS.ChordProFormatter();

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

    React.useEffect(() => {
        if (!router || appDataContext.loadingAppData) return;
        const { id } = router.query;
        if (!id) return;

        console.log("song loaded:", appDataContext.allSongs[id]);
        setSong(appDataContext.allSongs[id]);
        setSidebarState('hidden');
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

                // setTimeout(function () {
                //     setEditMode(EDIT_MODE.IDLE);
                //     document.getElementsByTagName('body')[0].classList = ""  // stop <body> rom scrolling
                // }, 500)
            }
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
            loading={appDataContext.isLoadingAppData || !song || editMode === EDIT_MODE.SAVING}
        />

        {!song ? <></> :

            <>
                <Toolbar
                    toggleLeftPane={toggleSidebar}
                    onStartEditing={startEditing}
                    currentSong={song}
                />

                <Sidebar state={sidebarState} currentSong={song} />

                <div className="py-24 mainbar flex flex-wrap justify-between">
                    <div className="w-full md:max-w-3xl flex-1 relative p-4 md:p-12">

                        <h1 className="">
                            <div className="text-white text-left text-2xl md:text-3xl">
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
                                    line-height: 1.5;
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
                            <div className="text-gray-200 leading-normal text-sm sm:text-base md:text-lg font-mono">
                                <div className="chordSheetViewer"
                                    dangerouslySetInnerHTML={{ __html: song['Chord Sheet'] ? formatChordSheet(song['Chord Sheet']) : '' }}>
                                </div>
                            </div>
                        </div>

                        {/* Edit Modal */}
                        <div className={`${editMode === EDIT_MODE.ACTIVE ? 'edit-modal--block' : 'edit-modal--hidden'} bg-gray-900 fixed z-30 left-0 top-0 w-screen h-screen duration-200 transition`}>
                            <div className="mx-auto">
                                <div className="border-b border-gray-700 border-opacity-50 bg-gray-800 bg-opacity-80" style={{ height: '45px' }}>
                                    <div className="h-full flex items-center justify-between px-4">
                                        <Button onClick={cancelEditing}>Cancel</Button>
                                        <div className="text-gray-400 text-center flex-1 text-lg w-24">
                                            Edit
                                        </div>
                                        <AsyncButton loading={editMode === EDIT_MODE.SAVING} success={editMode === EDIT_MODE.SUCCESS} onClick={saveEditing}>
                                            Save
                                        </AsyncButton>
                                    </div>
                                </div>
                                <div className="mx-auto">
                                    <textarea onChange={handleOnChangeChordSheet} value={editedChordSheet}
                                        style={{ height: 'calc(100vh - 45px)', paddingBottom: '70px', fontSize: '18px' }}
                                        className="bg-gray-900 w-full text-gray-200 leading-10 text-sm sm:text-base md:text-xl font-mono py-3 px-6 shadow-inner focus:outline-none">
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:max-w-xl p-4 md:p-12">
                        <div className="flex justify-center">
                            <div className="block md:hidden">
                                <Video url={song['YouTube Link']} light={true}
                                    width="300px" height="168.75px" controls={true} />
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