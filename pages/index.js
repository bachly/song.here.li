import React from 'react'
import _ from 'underscore';
import Header from '../components/Header';
import Layout from '../components/Layout';
import SectionTickList from '../components/SectionTickList';
import SectionNumberedList from '../components/SectionNumberedList';

export default function Home() {

    return (
        <Layout>
            <Header
                primaryName="Song"
                secondaryName="Here"
            />

            <SectionTickList
                tag="Features"
                title="What can you do with SongHere?"
                list={[
                    "View songs, chords, lyrics from personal AirTable base",
                    "View songs organised in groups from personal AirTable base",
                    "View performances of performances from personal AirTable base",
                    "Attach and view a YouTube video of the song",
                    "Search songs by title across multiple groups",
                    "Use on both Desktop and Mobile devices",
                    "Transpose a song and chords on the fly and save it back to AirTable",
                    "Edit the chords and lyrics in ChordPro format and save it back to AirTable",
                    "Keep all of your data in your personal AirTable. None of your data is saved anywhere else, even our system"
                ]}
            >
            </SectionTickList>

            <SectionNumberedList
                tag="How to start"
                title="3 easy steps to get you started"
                list={[
                    "Clone our AirTable base sample template.",
                    "Enter your AirTable API Key and Base ID.",
                    "Start using SongHere.",
                ]}
            >
            </SectionNumberedList>
        </Layout>
    );
}