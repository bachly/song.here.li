import React from 'react'
import _ from 'underscore';
import Airtable from 'airtable';
import { format } from 'date-fns';
import { useRouter } from 'next/router'
import Layout from '../page-components/Layout';
import SongList from '../page-components/SongList';
import HeaderForPage from '../page-components/HeaderForPage';
import SongDetails from '../page-components/SongDetails';
import { Container } from '../page-components/Common';

const AIRTABLE_API_KEY = 'keyjmQKQsWuyPGqct';
const AIRTABLE_BASE_ID = 'app8970gPuPsnHk2l';
var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export default function List({ tableName = 'Song List' }) {
    const router = useRouter()
    const { group } = router.query;
    const [items, setItems] = React.useState(null);

    const [popup, setPopup] = React.useState({
        visible: false,
        song: null
    })

    function closePopup(event) {
        event && event.preventDefault();

        document.getElementsByTagName('body')[0].classList = ""

        setPopup({
            visible: false
        })
    }

    function openPopup(song) {
        return (event) => {
            event && event.preventDefault();

            document.getElementsByTagName('body')[0].classList = "overflow-hidden fixed w-screen h-screen"

            setPopup({
                visible: true,
                song
            })
        }
    }

    function onSongUpdateSuccess({ song }) {
        setItems({
            ...items,
            [song.id]: {
                ...items[song.id],
                ...song
            }
        })

        setPopup({
            ...popup,
            song: {
                ...items[song.id],
                ...song
            }
        })

        console.log("Updated song:", song);
    }

    React.useEffect(function onLoad() {
        if (router) {
            const allItems = {};

            if (group) {

                const cleanGroupName = decodeURI(group).toLowerCase();

                /* Get Songs */
                base(tableName).select({
                    view: "All Songs",
                    filterByFormula: `LOWER({Group}) = "${cleanGroupName}"`,
                    fields: ['Name', 'Ready', 'Group', 'BPM', 'Key', 'YouTube Link', 'Chord Sheet', 'Author/Singer']
                }).all().then(function (records) {
                    records.forEach(function (record) {
                        const song = {
                            id: record.id,
                            'Name': record.get('Name') || null,
                            'Ready': record.get('Ready') || null,
                            'Group': record.get('Group') || null,
                            'Key': record.get('c') || null,
                            'BPM': record.get('BPM') || null,
                            'Key': record.get('Key') || null,
                            'Chord Sheet': record.get('Chord Sheet') || null,
                            'YouTube Link': record.get('YouTube Link') || null,
                            'Author/Singer': record.get('Author/Singer') || null,
                        }

                        allItems[song.id] = song;
                    });

                    setItems(allItems);
                });
            }
        }
    }, [router])

    return (
        <Layout>
            {router && items ?
                <div className="bg-gray-900 relative overflow-x-hidden">
                    <HeaderForPage tag="Song List" title={group} />

                    <Container>
                        <SongList songs={items} openPopup={openPopup} />
                    </Container>

                    {/* Popup */}
                    {
                        popup.song ?
                            <div id="popup" className={`${popup.visible ? 'block' : 'hidden'} fixed z-50 w-full h-full left-0 top-0`}>
                                <button className="fixed z-50 w-full h-full bg-gray-900 bg-opacity-30 backdrop-blur-md cursor-zoom-out" onClick={closePopup}>
                                    <span className="sr-only">Close popup</span>
                                </button>
                                <div className="w-full h-screen flex items-center justify-center">
                                    <div id="popupBody" className="w-full sm:max-w-2xl md:max-w-4xl lg:max-w-7xl z-50 realtive bg-gray-800 bg-opacity-40 border border-gray-700 border-opacity-50 rounded-2xl shadow-2xl overflow-hidden">
                                        <div style={{ height: "calc(100vh - 100px)" }}>
                                            <SongDetails //
                                                song={popup.song}
                                                onSongUpdateSuccess={onSongUpdateSuccess} />
                                        </div>
                                    </div>
                                </div>
                            </div> : <></>
                    }

                    <div className="pt-24"></div>
                </div> :
                <div className="bg-gray-900">
                    <div className="text-white h-screen w-screen flex items-center justify-center">
                        Loading...
                    </div>
                </div>}
        </Layout>
    );
}