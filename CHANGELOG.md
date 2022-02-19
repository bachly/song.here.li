# CHANGELOG

## 12 Feb 2022
- ✨ Error handling: Show error when unable to parse Chord Sheet
- 🔧 Read songs: Use React.createRef() for the Search Input to avoid React controlled components error
- 🔧 Read songs: Fetch song's 'Colour' field instead of 'Ready' field

# FEATURES

## Create songs
- ⛔ Not supported. User can only create songs via AirTable.

## Read songs
- ✅ List all songs, song groups and performances from AirTable 
- ✅ Format a ChordPro-formatted song
- ✅ Search a song by Title
- ✅ Play the song's attached audio
- ✅ Play the song's attached video
- ✅ Open the song in new tab
- Cache songs to IndexDB to improve speed
- Parse song's meta information
- Slide song in performances
- First song to be opened is the last song closed

## Update songs
- ✅ Change a song in ChordPro format
- ✅ Save the changed song in AirTable
- ✅ Transpose a song
- Save the transosed song in AirTable
- Change and save song's meta information

## Delete songs
- ⛔ Not supported. User can only delete songs via AirTable.

## PWA
- ✅ Responsiveness
- Installable
- Cacheable

## Error handling
- ✅ Display global error handling icon and dialog
- Log error in third-party service

## Publishable
- All keys are stored in server's environment variables

## Version 2.0
- User can load ChordPro songs and manage them privately
- User can share with others via publishing on the Internet (paid version)
- User can clone other's songs into their repertoire