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

export default function SongDetails2({ song, onSongUpdateSuccess }) {
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
        return formatter.format(song);
    }

    return (
        <>
            {song ?
                <div className="w-full relative py-6 px-12">

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
                            <div className="mt-2">
                                <textarea onChange={handleOnChangeChordSheet} value={editedChordSheet}
                                    className="w-full text-gray-200 bg-gray-900 bg-opacity-50 font-mono text-sm sm:text-base md:text-xl py-4 px-6 leading-normal shadow-inner focus:outline-none focus:ring focus:ring-teal-800 rounded-xl" style={{ minHeight: "calc(50vh)" }}>
                                </textarea>
                            </div>}
                    </div>

                    <div className="pt-24"></div>
                </div> :
                <div className="text-gray-300 h-screen flex items-center justify-center">Loading...</div>
            }
        </>
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