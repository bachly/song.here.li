export default function SongList({ songs, openPopup }) {
    if (!songs) return <></>

    return <>
        <div className="px-6">
            <div className="flex items-center text-gray-300 py-4 border-b border-gray-700 justify-between">
                <div className="px-4 uppercase tracking-widest text-gray-600 font-semibold text-sm text-center" style={{ width: "70px" }}>#</div>
                <div className="px-4 flex-1 uppercase tracking-widest text-gray-600 font-semibold text-sm" style={{ minWidth: "50%" }}>Title</div>
                <div className="px-4 flex-1 uppercase tracking-widest text-gray-600 font-semibold text-sm">Key</div>
                <div className="px-4 flex-1 uppercase tracking-widest text-gray-600 font-semibold text-sm">BPM</div>
            </div>
        </div>
        <div className="py-2 px-6">
            {songs?.map((song, index) => {
                return <button key={`song-${song.id}`}
                    onClick={openPopup && openPopup(song)}
                    className="w-full block text-left hover:bg-gray-800 hover:bg-opacity-50 border border-transparent rounded-md duration-100 transition cursor-pointer">
                    <div className="w-full flex items-center py-2">
                        <div className="px-4 text-gray-400 text-sm text-center" style={{ width: "70px" }}>{index}</div>
                        <div className="px-4 flex-1" style={{ minWidth: "50%" }}>
                            <h3 className="font-bold text-md text-white">{song['Name']}</h3>
                            <div className="mr-2">
                                {song['Author/Singer'] ?
                                    <span className="text-gray-400 text-sm">{song['Author/Singer']}</span>
                                    : <span className="text-gray-400 text-sm">Unknown</span>}
                            </div>
                        </div>
                        <div className="px-4 flex-1">
                            {song['Key'] ?
                                <div className="text-sm text-white pl-2">
                                    {song['Key']}
                                </div>
                                : <></>}</div>
                        <div className="px-4 flex-1">
                            {song['BPM'] ?
                                <div className="text-sm text-white pl-2">
                                    {song['BPM']}
                                </div>
                                : <></>}</div>
                    </div>
                </button>
            })}
        </div>
    </>
}