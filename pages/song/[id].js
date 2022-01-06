import Airtable from 'airtable';
import SongDetails2 from '../../page-components/SongDetails2';
import { useRouter } from 'next/router';
import React from 'react';
import HeaderToolbar from '../../components/HeaderToolbar';

export default function Song() {
    const router = useRouter();
    const [song, setSong] = React.useState();

    React.useEffect(() => {
        if (!router) return;

        const { id } = router.query;

        if (!id) return;

        const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

        base('Song List').find(id, (err, record) => {
            const song = {
                id: id,
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

            console.log('song', song)

            setSong(song);
        });
    }, [router])

    return <>
        <HeaderToolbar
            primaryName="Song"
            secondaryName="Here"
            userName="Bach"
        />
        <SongDetails2 song={song} />
    </>
}