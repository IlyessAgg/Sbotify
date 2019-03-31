'use strict';
require('dotenv').config();

const Readline = require('readline');
const rl = Readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
})

const matcher = require('./matcher');
const clc = require('cli-color');
const apikey = process.env.APIKEY;
const music = require('musicmatch')({apikey:apikey});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', reply => {
	var cb = matcher(reply,cb);
	switch(cb.intent){
		
			case 'Hello':
				console.log(clc.greenBright(" Hello there! I'm Sbotify :) What do you want from me ?"));
				rl.prompt();
				break;
				
			case 'Exit':
				console.log(clc.yellowBright(" See you another time ;)"));
				process.exit(0);
				
			case 'SameArtists':
			var artistId;
				(async () => {
					// Fetching the artist ID.
					await music.artistSearch({q_artist:cb.entities.artist, page_size:2})
					.then(function(data){
						var artistList = data.message.body.artist_list;
						if(artistList != undefined && artistList.length != 0){
							artistId = artistList[0].artist.artist_id;
						}
					}).catch(function(err){
						console.log(err);
				});

					if(artistId != undefined){
					// Fetching related artists.
					await music.artistRelated({artist_id:artistId, page_size:5, page:1})
						.then(function(data){
							var artistList = data.message.body.artist_list;
							if(artistList != undefined){
								console.log(" Here are five artists like " + clc.cyanBright(cb.entities.artist) + " :");
								for(var artist of artistList){
									console.log(" > " + artist.artist.artist_name);
								}
							}
						}).catch(function(err){
							console.log(err);
					});
					}
					else console.log(clc.redBright(" Couldn't find this artist :("));
						rl.prompt();
					})();
				
				break;
				
			case 'ArtistAlbums':
				var artistId;
				(async () => {
					// Fetching the artist ID.
					await music.artistSearch({q_artist:cb.entities.artist, page_size:2})
					.then(function(data){
						var artistList = data.message.body.artist_list;
						if(artistList != undefined && artistList.length != 0){
							artistId = artistList[0].artist.artist_id;
						}
					}).catch(function(err){
						console.log(err);
				});

					if(artistId != undefined){
					// Fetching albums.

					await music.artistAlbums({artist_id:artistId, s_release_date:"desc", g_album_name:1})
						.then(function(data){
							var albumList = data.message.body.album_list;
							
							if(albumList != undefined){
								console.log(" Here are the latest albums of " + clc.cyanBright(cb.entities.artist) + " :");
								for(var album of albumList){
									console.log(" > " + album.album.album_name);
								}
							}
							
						}).catch(function(err){
							console.log(err);
					});
					}
					else console.log(clc.redBright(" Couldn't find this artist :("));
						rl.prompt();
					})();
				
				break;


			default: {
				console.log(clc.magentaBright(" I'm sorry I didn't understand that."));
				rl.prompt();
				break;
			}
		}

});

