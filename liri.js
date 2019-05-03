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
var moment = require('moment');
const fs = require('fs')


var spotify = new Spotify(keys.spotify);
// grabs the string after node & the file name in the command line, should be a command
var userCommand = process.argv[2];
// grabs the string after the command as the default query
var userQuery = process.argv[3];
var formattedUserQuery = null;

// =============================================================================
// declare functions
// =============================================================================

// -----------------------------------------------------------------------------
// userQuery formatting functions
// -----------------------------------------------------------------------------

/* grab multiple strings (if user enters multiple words and uses spaces)
and combines them into one single string
*/
function queryCombine(nextWordinQuery) {
    userQuery += "+" + nextWordinQuery;
}

/* for any queries that are more than one word (string / entry) long, this for loop
combines them together
*/
for (let i = 4; i < process.argv.length; i++) {
    queryCombine(process.argv[i]);
    console.log(userQuery);
}

function formatQueryForDisplay(userQuery) {
    formattedUserQuery = userQuery.replace(/\+/g, " ");
}


// -----------------------------------------------------------------------------
// Bands in Town API functions
// -----------------------------------------------------------------------------
// concert-this
function getConcertInfo() {
    // test case Skrillex (no user input yet)
    axios.get(`https://rest.bandsintown.com/artists/${userQuery}/events?app_id=codingbootcamp&date=upcoming`)
        .then(function (response) {

            displayConcertInfo(response)
        })
}

function displayConcertInfo(response) {
    formatQueryForDisplay(userQuery)
    console.log(`
---------------------------------------------------------------------------------
Here are some upcoming concerts I found for ${formattedUserQuery}:
---------------------------------------------------------------------------------
    `);
    
    for (let eventCount = 1; eventCount < 6; eventCount++) {
        // grabbing the unformatted concert date
        let concertDate = response.data[eventCount].datetime;
        // reformatting with moment
        let formattedConcertDate = moment(concertDate).format("MM/DD/YYYY");
        // displaying event info to the terminal
        console.log(`
---------------------------------------------------------------------------------
Date: ${formattedConcertDate}
Venue: ${response.data[eventCount].venue.name}
Venue location: ${response.data[eventCount].venue.city}, ${response.data[eventCount].venue.country}
---------------------------------------------------------------------------------
        `);
    }
}

// -----------------------------------------------------------------------------
// Spotify API functions (command: spotify-this-song)
// -----------------------------------------------------------------------------
function getSongInfo() {
    // if no song is provided, default to "The Sign" by Ace of Base (assignment instructions)
    if (userQuery === undefined) {
        userQuery = "The Sign";
        /* "The Sign" by Ace of Base currently displays as the 11th result in the list
        if I allow for > 10 results to display.
        */
    }
    // requests data for the userQuery song name
    spotify.search({ type: 'track', query: `${userQuery}`, limit: 5}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        displaySongInfo(data)
      });
}

function displaySongInfo(data) {
    formatQueryForDisplay(userQuery)
    console.log(`
---------------------------------------------------------------------------------
Here are some tracks I found when I searched for ${formattedUserQuery}:
---------------------------------------------------------------------------------
        `);
    // displays info for the first five songs that are found from the userQuery
    for (let songResultNumber = 0; songResultNumber < 5; songResultNumber++) {
    console.log(`
---------------------------------------------------------------------------------
Artist(s): ${data.tracks.items[songResultNumber].artists[0].name}
Song name: ${data.tracks.items[songResultNumber].name}
Preview link (if available): ${data.tracks.items[songResultNumber].preview_url}
Appears on album: ${data.tracks.items[songResultNumber].album.name}
---------------------------------------------------------------------------------
    `);
    }
}

// -----------------------------------------------------------------------------
// OMDB API functions (command: movie-this)
// -----------------------------------------------------------------------------
// the user enters the movie-this command followed by a movie title
function getMovieInfo() {
    // console.log(userQuery);
    // if no movie entered, default to "Mr. Nobody"
    if (userQuery === undefined) {
        userQuery = "Mr. Nobody.";
    }

    axios.get(`http://www.omdbapi.com/?t=${userQuery}&y=&plot=short&apikey=trilogy`)
    .then(function (response) {
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

// -----------------------------------------------------------------------------
// read random.txt file: take command and query and run LIRI (do-what-it-says)
// -----------------------------------------------------------------------------

function readRandomTxtFile() {
    // read the random.txt file
    fs.readFile('random.txt', 'utf8', function (error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
        return console.log(error)
    }
    // split the text file data by commas and place into an array
    var dataArr = data.split(',')

    // assign command and query values based on the text file data
    userCommand = dataArr[0];
    userQuery = dataArr[1];
    // run the switch case with the given command
    runLiri(userCommand)
    })
}

function runLiri(userCommand) {
    // switch case
    switch (userCommand) {
        case "concert-this":
            getConcertInfo()
            // displayConcertInfo()
            break;
        case "spotify-this-song":
            getSongInfo()
            break;
        case "movie-this":
            getMovieInfo()
            break;
        case "do-what-it-says":
            readRandomTxtFile()
        break;
    }
}

// takes in user input and runs the appropriate functions / searches
runLiri(userCommand)