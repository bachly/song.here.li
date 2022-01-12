import React from 'react'
import _ from 'underscore';
import Airtable from 'airtable';
import { format } from 'date-fns';
import { useRouter } from 'next/router'
import Layout from '../page-components/Layout';
import SongList from '../page-components/SongList';
import HeaderForPage from '../page-components/HeaderForPage';
import SongDetails from '../page-components/SongDetails';
import { Container } from './Common';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Spinner from '../components/Spinner';

var base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

export default function List({ tableName = 'Song List' }) {
    const router = useRouter()
    const { group } = router.query;
    const [songs, setSongs] = React.useState(null);

    const [popup, setPopup] = React.useState({
        visible: false,
        activeSlideIndex: null
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
                activeSlideIndex: Object.keys(songs).findIndex(id => id === song?.id)
            })
        }
    }

    function onSongUpdateSuccess({ song }) {
        setSongs({
            ...songs,
            [song.id]: {
                ...songs[song.id],
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

                    setSongs(allItems);
                });
            }
        }
    }, [router])

    function setActiveSlideIndex(swiper) {
        console.log("swiper:", swiper);
        setPopup({
            visible: true,
            activeSlideIndex: swiper.activeIndex
        });
    }

    return (
        <Layout>
            {router && songs ?
                <div className="bg-gray-900 relative overflow-x-hidden">
                    <HeaderForPage tag="Song List" title={group} />

                    <Container>
                        <SongList songs={songs} openPopup={openPopup} />
                    </Container>

                    {/* Popup */}
                    {
                        popup.visible ?
                            <div id="popup" className={`${popup.visible ? 'block' : 'hidden'} fixed z-50 w-full h-full left-0 top-0`}>
                                <button className="fixed z-40 w-full h-full bg-gray-900 bg-opacity-30 backdrop-blur-md cursor-zoom-out" onClick={closePopup}>
                                    <span className="sr-only">Close popup</span>
                                </button>

                                <div id="popup-content">
                                    <Swiper //
                                        modules={[Navigation, Pagination]}
                                        initialSlide={popup.activeSlideIndex}
                                        slidesPerView={'auto'}
                                        spaceBetween={30}
                                        centeredSlides={true}
                                        navigation
                                        pagination={{ clickable: true }}
                                        allowTouchMove={false}
                                        onActiveIndexChange={setActiveSlideIndex}
                                        style={{ zIndex: '50', width: '100vw', height: 'calc(100vh - 170px)', top: '70px' }} className="relative text-white">
                                        {songs && Object.keys(songs).map((id, index) => {
                                            const song = songs[id];
                                            return <SwiperSlide key={song.id}
                                                style={{ height: 'calc(100vh - 210px)' }}
                                                className="relative w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-7xl z-50 realtive bg-gray-800 bg-opacity-80 border border-gray-700 border-opacity-50 rounded-2xl shadow-2xl overflow-hidden">
                                                {popup.activeSlideIndex !== index ?
                                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-30 backdrop-blur-sm"></div>
                                                    : <></>}

                                                <SongDetails //
                                                    song={song}
                                                    onSongUpdateSuccess={onSongUpdateSuccess} />
                                            </SwiperSlide>
                                        })}
                                    </Swiper>
                                </div>

                            </div> : <></>
                    }

                    <div className="pt-24"></div>
                </div> :
                <div className="bg-gray-900">
                    <div className="text-white h-screen w-screen flex items-center justify-center">
                        <Spinner />
                    </div>
                </div>
            }
        </Layout >
    );
}