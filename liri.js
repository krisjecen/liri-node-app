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

// -----------------------------------------------------------------------------
// user input variables
// -----------------------------------------------------------------------------
// grabs the string after node & the file name in the command line, should be a command
var userCommand = process.argv[2];
// grabs the string after the command as the default query
var userQuery = process.argv[3];
// the userQuery will be formatted -- see formatQueryForDisplay
var formattedUserQuery = null;

// =============================================================================
// declare functions
// =============================================================================

// -----------------------------------------------------------------------------
// userQuery formatting functions
// -----------------------------------------------------------------------------

/* grab multiple strings (if user enters multiple words and uses spaces)
and combines them into one single string -- can/should i combine this with the for loop?
*/
function queryCombine(nextWordinQuery) {
    userQuery += "+" + nextWordinQuery;
}

/* for any queries that are more than one word (string / entry) long, this for loop
combines them together
*/
for (let i = 4; i < process.argv.length; i++) {
    queryCombine(process.argv[i]);
}

function formatQueryForDisplay(userQuery) {
    if (userQuery != undefined){
    formattedUserQuery = userQuery.replace(/\+/g, " ");
    }
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
    if (userQuery != undefined) {

    
        let output = `
---------------------------------------------------------------------------------
Here are some upcoming concerts I found for ${formattedUserQuery}:
---------------------------------------------------------------------------------
    `;
    
        for (let eventCount = 1; eventCount < 6; eventCount++) {
            // grabbing the unformatted concert date
            let concertDate = response.data[eventCount].datetime;
            // reformatting with moment
            let formattedConcertDate = moment(concertDate).format("MM/DD/YYYY");
            // displaying event info to the terminal
            output += `
---------------------------------------------------------------------------------
Date: ${formattedConcertDate}
Venue: ${response.data[eventCount].venue.name}
Venue location: ${response.data[eventCount].venue.city}, ${response.data[eventCount].venue.country}
---------------------------------------------------------------------------------
            `;
        }

        console.log(output);
        logOutputToTxtFile(output);
    } else {
        console.log("No band or artist name was entered.")
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
    spotify.search({ type: 'track', query: `${userQuery}`, limit: 15}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        displaySongInfo(data)
      });
}

function displaySongInfo(data) {
    formatQueryForDisplay(userQuery)
    let output = `
---------------------------------------------------------------------------------
Here are some tracks I found when I searched for ${formattedUserQuery}:
---------------------------------------------------------------------------------
        `;
    // displays info for the first five songs that are found from the userQuery
    for (let songResultNumber = 0; songResultNumber < 15; songResultNumber++) {
        output += `
---------------------------------------------------------------------------------
Artist(s): ${data.tracks.items[songResultNumber].artists[0].name}
Song name: ${data.tracks.items[songResultNumber].name}
Preview link (if available): ${data.tracks.items[songResultNumber].preview_url}
Appears on album: ${data.tracks.items[songResultNumber].album.name}
---------------------------------------------------------------------------------
        `;
    }

    console.log(output);
    logOutputToTxtFile(output);
}

// -----------------------------------------------------------------------------
// OMDB API functions (command: movie-this)
// -----------------------------------------------------------------------------
// the user enters the movie-this command followed by a movie title
function getMovieInfo() {
    // if no movie entered, default to "Mr. Nobody"
    if (userQuery === undefined) {
        userQuery = "Mr. Nobody";
    }

    axios.get(`http://www.omdbapi.com/?t=${userQuery}&y=&plot=short&apikey=trilogy`)
    .then(function (response) {
        displayMovieInfo(response)
    })
}

function displayMovieInfo(response) {
    formatQueryForDisplay(userQuery)
    let output = `
---------------------------------------------------------------------------------
Here is the film I found when I searched for ${formattedUserQuery}:
---------------------------------------------------------------------------------

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
        `;
    console.log(output);

    logOutputToTxtFile(output)
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

// bonus: log the results
function logOutputToTxtFile(output) {
    // append the output from the search to the log.txt file
    fs.appendFile('log.txt', output, function(err) {
        if (err) {
            console.log(err)
          } else { // If no error is experienced, display success message to node console.
            console.log('Content added to log!')
          }
    })
}

// -----------------------------------------------------------------------------
// main switch case function to run LIRI with one of four user commands
// -----------------------------------------------------------------------------

function runLiri(userCommand) {
    switch (userCommand) {
        case "concert-this":
            getConcertInfo()
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

// =============================================================================
// initialilze LIRI
// =============================================================================
runLiri(userCommand)

// =============================================================================
// end of code
// =============================================================================