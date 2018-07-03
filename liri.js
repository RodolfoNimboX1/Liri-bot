require("dotenv").config();
//variables
var keys = require("./keys.js");
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var client = new Twitter(keys.twitterKeys);
var input = process.argv;
var action = input[2];
var inputs = input[3];

//commands
switch (action) {
	case "tweet-it":
	myTwits(inputs);
	break;

	case "spotify-it":
	spotifySong(inputs);
	break;

	case "movie-it":
	movieChoice(inputs);
	break;

	case "just-do-it":
	nike();
	break;
};

//20 tweets from account linked
function myTwits(inputs) {
	var param = {screen_name: inputs, 
		         count: 20};
	
		client.get('statuses/user_timeline', param, function(error, tweets, response) {
			if (!error) {
				for (i = 0; i < tweets.length; i ++){
					console.log("My Tweet: " + "'" + tweets[i].text + "'" + " Created At: " + tweets[i].created_at);
				}
			} else {
				console.log(error);
			}
		});
}

function spotifySong(inputs) {

    var spotify = new Spotify(keys.spotifyKeys);
    //default song
		if (!inputs){
        	inputs = 'Love the way you lie';
            }
            //song search
		spotify.search({ type: 'track', query: inputs }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	                return;
	        }
	        var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
	});
}


function movieChoice(inputs) {

	var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(error, response, body) {
		if (!inputs){
        	inputs = 'The Avengers';
    	}
		if (!error && response.statusCode === 200) {
		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
};

function nike() {
	fs.readFile('random.txt', "utf8", function(error, data){
		if (error) {
    		return console.log(error);
  		}
		// Line split by commas to identify indexes
        var dataArr = data.split(",");
        //includes all commands in case it is changed from the random.txt file
		if (dataArr[0] === "spotify-it") {
			var songcheck = dataArr[1].slice(1, -1);
			spotifySong(songcheck);
		} else if (dataArr[0] === "tweet-it") {
			var tweetname = dataArr[1].slice(1, -1);
			myTwits(tweetname);
		} else if(dataArr[0] === "movie-it") {
			var movie_name = dataArr[1].slice(1, -1);
			movieChoice(movie_name);
		} 
  	});
};