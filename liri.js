// =============================================================================
// JS for LIRI Bot
/* takes one of four user commands + a query about bands, songs, movies, and 
outputs details about the user's query */
// =============================================================================

require("dotenv").config();

// =============================================================================
// initialize variables
// =============================================================================

// -----------------------------------------------------------------------------
// required files and packages
// -----------------------------------------------------------------------------
var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');

// TODO define Spotify (currently throws error Spotify is not defined)
var spotify = new Spotify(keys.spotify);
// grabs the string after node & the file name in the command line, should be a command
var userCommand = process.argv[2];
// grabs the string after the command
// TODO: this is simplified, need to make it grab multiple strings (if user uses spaces)
var userQuery = process.argv[3];

// =============================================================================
// declare functions
// =============================================================================

// -----------------------------------------------------------------------------
// Bands in Town API functions
// -----------------------------------------------------------------------------
// concert-this
// function getConcertInfo

    // Concert info to retrieve:
    // Name of the venue
    // Venue location
    // Date of the Event (use moment to format this as "MM/DD/YYYY")

// function displayConcertInfo

// -----------------------------------------------------------------------------
// Spotify API functions (command: spotify-this-song)
// -----------------------------------------------------------------------------
function getSongInfo() {
    // TODO: if no song is provided, default to "The Sign" by Ace of Base
    // requests data for the userQuery song name
    spotify.search({ type: 'track', query: `${userQuery}` }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      // console.log(data); 
      // console.log(data.tracks); 
      // console.log(data.tracks.items[0]); 
        displaySongInfo(data)



      });
}
    // Song info to retrieve:
    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
    
function displaySongInfo(data) {
    console.log(`
---------------------------------------------------------------------------------
Artist(s): ${data.tracks.items[0].artists[0].name} 
Song name: ${data.tracks.items[0].name} 
Preview link: ${data.tracks.items[0].preview_url} 
Appears on album: ${data.tracks.items[0].album.name}
---------------------------------------------------------------------------------
    `); 
}

// -----------------------------------------------------------------------------
// OMDB API functions (command: movie-this)
// -----------------------------------------------------------------------------
// the user enters the movie-this command followed by a movie title
function getMovieInfo() {
    console.log(userQuery);
    // if no movie entered, default to "Mr. Nobody"
    if (userQuery === undefined) {
        userQuery = "Mr. Nobody.";
    }
    
    axios.get(`http://www.omdbapi.com/?t=${userQuery}&y=&plot=short&apikey=trilogy`)
    .then(function (response) {
        //console.log(response);
        //console.log(response.data.Ratings);
        displayMovieInfo(response)
    })
}

function displayMovieInfo(response) {
    console.log(`
---------------------------------------------------------------------------------
Movie title: ${response.data.Title}
Year released: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}
Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
Produced in (country): ${response.data.Country}
Language(s): ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}
---------------------------------------------------------------------------------
        `)
}

// do-what-it-says
// function readRandomTxtFile()


// switch case
switch (userCommand) {
    case "concert-this":
        // getConcertInfo()
        // displayConcertInfo()
        break;
    case "spotify-this-song":
        getSongInfo()
        // displaySongInfo()
        break;
    case "movie-this":
        getMovieInfo()
        break;
    case "do-what-it-says":
        // readRandomTxtFile()
    break;
}