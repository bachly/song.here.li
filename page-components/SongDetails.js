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
            onSongUpdateSuccess({
                song: {
                    id: song.id,
                    "Chord Sheet": records[0].get("Chord Sheet")
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
        <div className="w-full h-full">
            {song ?
                <div className="w-full h-full relative">

                    <div className="absolute z-20 top-4 right-0 flex items-center px-6">
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

                    <div className="absolute top-0 left-0 w-full z-10 bg-gray-900 bg-opacity-10 backdrop-blur-md">

                        <div className="pt-2"></div>

                        <h1 className="relative z-10 pt-2 px-6 max-w-7xl mx-auto">
                            <div className="text-white text-left text-lg sm:text-2xl md:text-3xl">
                                <span className="font-bold">{song['Name']}</span>
                            </div>
                            <div className="text-left text-gray-300 text-sm md:text-base font-regular opacity-60">
                                {song['Author/Singer']}
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
                                            className="w-full text-gray-200 bg-black font-mono text-sm sm:text-base md:text-xl py-4 px-6 leading-normal shadow-inner focus:outline-none focus:ring focus:ring-teal-800 rounded-xl" style={{ minHeight: "calc(50vh)" }}>
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