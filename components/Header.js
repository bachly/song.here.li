import React from 'react'
import Spinner from './Spinner'

export default function Header({ primaryName, secondaryName, user, loading }) {
    return <>
        <div id="MarketingNav" className="w-full z-10">
            <div className="h-full max-w-5xl mx-auto pt-12 px-4 flex items-center">
                <div id="logo" className="h-full flex items-center select-none">
                    <img src="/img/songhere-logo.svg" className="w-16 mr-2" />
                    <span className="text-white font-semibold text-3xl">{primaryName}</span>
                    <span className="text-white font-thin text-3xl">{secondaryName}</span>
                    {loading ? <span className="ml-2 flex items-center"><Spinner /></span> : <></>}
                </div>
                <div id="user" className="h-full flex items-center ml-auto">
                    <a className="inline-block bg-gradient-to-br from-emerald-500 to-primary-600 text-lg text-white font-semibold py-2 px-6 rounded-md hover:opacity-90 duration-200 transition ease-in-out" href={'/song'}>Use app</a>
                </div>
            </div>
        </div>
        <section id="MarketingHero">
            <div className="pt-12 px-4 text-center">
                <h1 className="font-bold text-white text-opacity-90 text-2xl sm:text-3xl md:text-6xl max-w-3xl mx-auto" style={{ lineHeight: '1.25' }}>
                    Easily manage your <br /> Songs, Chords &amp; Lyrics.
                </h1>
                <div className="pt-1 md:pt-4"></div>
                <p className="font-light text-white text-opacity-50 w-3/4 mx-auto text-base md:text-3xl max-w-lg mx-auto" style={{ lineHeight: '1.5' }}>
                    SongHere is an app that lets you manage your Songs, Chords, Lyrics, Recordings &amp; Videos. All in one place.
                </p>
                <div className="pt-8"></div>
                <a className="inline-block bg-gradient-to-br from-emerald-500 to-primary-600 text-lg text-white font-semibold py-2 px-6 rounded-md hover:opacity-90 duration-200 transition ease-in-out" href={'/song'}>Use app</a>
            </div>
            <div className="pt-24"></div>
        </section>
    </>
}