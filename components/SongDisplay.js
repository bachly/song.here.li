import React from 'react';
import Video from 'react-player';

export default function SongDisplay({ song, errorParsingSong }) {
    let songWithChordSheetJS;

    const [parsedSong, setParsedSong] = React.useState(null);

    React.useEffect(() => {
        try {
            if (song['Chord Sheet'] === '') {
                songWithChordSheetJS = {
                    ...song,
                    'Chord Sheet JS Song': null
                }
            } else {
                chordSheetJsSong = song ? parser.parse(song['Chord Sheet']) : null;
                songWithChordSheetJS = {
                    ...song,
                    'Chord Sheet JS Song': {
                        _original: chordSheetJsSong,
                        artist: chordSheetJsSong ? chordSheetJsSong.metadata?.artist : '',
                        key: chordSheetJsSong ? chordSheetJsSong.metadata?.key : '',
                        paragraphs: chordSheetJsSong ? JSON.parse(JSON.stringify(chordSheetJsSong.paragraphs)) : []
                    }
                }
            }
        } catch (error) {
            console.warn("ERROR_PARSING_CHORD_SHEET", error);
            songWithChordSheetJS = {
                ...song,
                'Chord Sheet JS Song': null
            }
        } finally {
            setParsedSong(songWithChordSheetJS);
        }
    }, [song])

    return <div className="mainbar pb-24" style={{ marginTop: '45px' }}>
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
                    {errorParsingSong ?
                        <>
                            {song['Chord Sheet']}
                        </> :
                        <ChordSheetJsSongDisplay chordSheetJsSong={song['Chord Sheet JS Song']} />
                    }
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