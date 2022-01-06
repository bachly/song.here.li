import Link from "next/link";

export default function SongListWithLinks({ songs = {} }) {
    if (!songs) return <></>

    return <>
        {Object.keys(songs).map(id => {
            const song = songs[id];

            if (!song['Name']) return <div key={`song-item-${id}`}></div>;

            return <div key={`song-item-${id}`}>
                <Link href={`/song/${id}`}>
                    <a className="pl-8 w-full block text-left hover:bg-gray-700 hover:bg-opacity-50 duration-100 transition cursor-pointer">
                        <div className="py-3 border-b border-gray-700 border-opacity-50">
                            <h3 className="font-bold text-md text-white">{song['Name']}</h3>
                            <div className="mr-2">
                                {song['Author/Singer'] ?
                                    <span className="text-gray-400 text-sm">{song['Author/Singer']}</span>
                                    : <span className="text-gray-400 text-sm">Unknown</span>}
                                {song['Key'] ?
                                    <span className="text-sm text-primary-400 ml-2">
                                        {song['Key']}
                                    </span>
                                    : <></>}
                                {song['Group'] ?
                                    <span className="text-sm text-gray-400 ml-2">
                                        {song['Group']}
                                    </span>
                                    : <></>}
                            </div>
                        </div>
                    </a>
                </Link>
            </div>
        })}
    </>
}