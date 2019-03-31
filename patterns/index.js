const patternDict = [{
	pattern : "\\b(?<greeting>Hi|Hello|Hey|What's up)\\b",
	intent : 'Hello'
	},{
	pattern :'\\b(bye|exit)\\b',
	intent : 'Exit'
	},{
	pattern :'artists?\\s(like|related)\\s(to\\s)?\\b(?<artist>.+)',
	intent : 'SameArtists'
	},{
	pattern :'albums?\\sof\\s\\b(?<artist>.+)',
	intent : 'ArtistAlbums'
}];

module.exports = patternDict ;