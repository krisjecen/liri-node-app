# liri-node-app
LIRI is similar to Apple's Siri: LIRI takes text queries about songs, musical groups, and movies via the CLI and outputs info on music, concerts, and/or films. LIRI is run in Node.JS. See LIRI in action here: (youtube link)

When you are using Node.JS, you type `node liri.js` and then:

You can find info on...............by adding:
* band concerts..............`concert-this "Band Name"`
* songs...............................`spotify-this-song "Song Title"`
* movies.............................`movie-this "Movie Title"`

For example, if you wanted to find concerts by lovelytheband, you'd enter:
`node liri.js concert-this lovelytheband`

...and the app would serve up the next five upcoming concert dates, venue names, and (city + country) locations.
