import React from 'react';
import ChordSheetJS from 'chordsheetjs';
import Airtable from 'airtable';
import Video from 'react-player';

const EDIT_MODE = {
    'IDLE': 'IDLE',
    'ACTIVE': 'ACTIVE',
    'ERROR': 'ERROR',
    'SUCCESS': 'SUCCESS'
}

export default function SongDetails({ song, onSongUpdateSuccess }) {
    const [editedChordSheet, setEditedChordSheet] = React.useState('');
    const [editMode, setEditMode] = React.useState(EDIT_MODE.IDLE);
    const [editMessage, setEditMessage] = React.useState('');

    const parser = new ChordSheetJS.ChordProParser();
    const formatter = new ChordSheetJS.HtmlDivFormatter();

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
        //serializedSong = new ChordSheetJS.ChordSheetSerializer().serialize(song);
        //console.log('serialized song:', serializedSong);
        return formatter.format(song);
    }

    return (
        <div className="w-full h-full">
            {song ?
                <div className="w-full h-full relative">

                    <div className="absolute z-20 top-4 right-0 flex items-center px-6">
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
                    </div>

                    <div className="absolute top-0 left-0 w-full z-10 bg-gray-900 bg-opacity-10 backdrop-blur-md">

                        <div className="pt-2"></div>

                        <h1 className="relative z-10 pt-2 px-6 max-w-7xl mx-auto">
                            <div className="text-white text-left text-lg sm:text-2xl md:text-3xl">
                                <span className="font-bold">{song['Name']}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="text-left text-gray-300 text-sm md:text-base font-regular opacity-60">
                                    {song['Author/Singer']}
                                </div>
                                <div className="ml-2 text-left text-gray-300 text-sm md:text-base font-regular opacity-60">
                                    Key: {song['Key']}
                                </div>
                            </div>
                        </h1>

                        <div className="pt-2"></div>
                    </div>

                    <div className="absolute z-0 left-0 w-full">
                        <div className="overflow-y-scroll" style={{ height: `calc(100vh)` }}>
                            <div className="pt-24"></div>

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

                            <div className="mt-6 px-6">
                                <h2 className="text-gray-500 uppercase text-sm tracking-widest border-b border-gray-600 border-opacity-60 pb-2">Chord Sheet</h2>
                            </div>

                            <div className="mx-auto">
                                {editMode === EDIT_MODE.IDLE || editMode === EDIT_MODE.SUCCESS ?
                                    <>
                                        <div className="text-gray-200 leading-normal text-sm sm:text-base md:text-xl px-6">
                                            <div className="chordSheetViewer"
                                                dangerouslySetInnerHTML={{ __html: song['Chord Sheet'] ? formatChordSheet(song['Chord Sheet']) : '' }}>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div className="mt-2 px-6">
                                        <textarea onChange={handleOnChangeChordSheet} value={editedChordSheet}
                                            className="w-full text-gray-200 bg-gray-900 bg-opacity-50 font-mono text-sm sm:text-base md:text-xl py-4 px-6 leading-normal shadow-inner focus:outline-none focus:ring focus:ring-teal-800 rounded-xl" style={{ minHeight: "calc(50vh)" }}>
                                        </textarea>
                                    </div>}
                            </div>

                            <div className="mt-12 px-6 py-12l">
                                <h3 className="text-gray-500 uppercase text-sm tracking-widest border-b border-gray-600 border-opacity-60 pb-2">Youtube Video</h3>
                                <div className="max-w-2xl">
                                    <div className="mt-4 relative w-full h-full pb-9/16">
                                        {song['YouTube Link'] ?
                                            <Video url={song['YouTube Link']} />
                                            : <></>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-48"></div>
                        </div>
                    </div>
                </div> :
                <div className="text-gray-300 h-screen flex items-center justify-center">Loading...</div>
            }
        </div>
    );
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