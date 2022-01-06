export default function SongListWithLinks({ songs = {} }) {
    if (!songs) return <></>

    return <>
        <div className="">
            {Object.keys(songs).map((id, index) => {
                const song = songs[id];

                if (!song['Name']) return;

                return <a key={`song-${song.id}`}
                    href={`/song/${song.id}`}
                    className="pt-2 pl-8 pr-4 pb-2 border-b border-gray-700 border-opacity-50 w-full block text-left hover:bg-gray-800 hover:bg-opacity-50 rounded-md duration-100 transition cursor-pointer">
                    <div className="flex-1" style={{ minWidth: "50%" }}>
                        <h3 className="font-bold text-md text-white">{song['Name']}</h3>
                        <div className="mr-2">
                            {song['Author/Singer'] ?
                                <span className="text-gray-400 text-sm">{song['Author/Singer']}</span>
                                : <span className="text-gray-400 text-sm">Unknown</span>}
                        </div>
                    </div>
                    <div className="flex-1">
                        {song['Key'] ?
                            <div className="text-sm text-white pl-2">
                                {song['Key']}
                            </div>
                            : <></>}</div>
                    {/* <div className="flex-1">
                        {song['BPM'] ?
                            <div className="text-sm text-white pl-2">
                                {song['BPM']}
                            </div>
                            : <></>}</div> */}
                </a>
            })}
        </div>
    </>
}