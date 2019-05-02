// =============================================================================
// JS for LIRI Bot
/* takes one of four user commands + a query about bands, songs, movies, and 
outputs details about the user's query */
// =============================================================================

require("dotenv").config();

// =============================================================================
// initialize variables
// =============================================================================

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var userCommand = process.argv[2];
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
// function getSongInfo()
    // if no song is provided, default to "The Sign" by Ace of Base

    // Song info to retrieve:
    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
    
// function displaySongInfo()

// -----------------------------------------------------------------------------
// OMDB API functions (command: movie-this)
// -----------------------------------------------------------------------------
// the user enters the movie-this command followed by a movie title
// function getMovieInfo()
    // if no movie entered, default to "Mr. Nobody"

    /*
    * Title of the movie.
    * Year the movie came out.
    * IMDB Rating of the movie.
    * Rotten Tomatoes Rating of the movie.
    * Country where the movie was produced.
    * Language of the movie.
    * Plot of the movie.
    * Actors in the movie.
    */
// function displayMovieInfo()

// do-what-it-says
// function readRandomTxtFile()


// switch case
switch (userCommand) {
    case "concert-this":
        // getConcertInfo()
        // displayConcertInfo()
        break;
    case "spotify-this-song":
        // getSongInfo()
        // displaySongInfo()
        break;
    case "movie-this":
        // getMovieInfo()
        // displayMovieInfo()
        break;
    case "do-what-it-says":
        // readRandomTxtFile()
    break;
}