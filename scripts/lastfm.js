var api_key = 'b5d98464c82acbabb4ee727c9b683d7d';
var user = 'darcycox97';
var api_root = 'http://ws.audioscrobbler.com/2.0/';
var lastfm_root = 'https://www.last.fm/music/';
var speaker_class = 'glyphicon glyphicon-volume-up';

$("document").ready(function() {

    // make the initial request
    sendRecentTracksRequest();

    var albumsRequest = new XMLHttpRequest();
    window.setInterval(sendRecentTracksRequest, 10000); // resend the request every 10 sec.

});



function sendRecentTracksRequest() {

    var trackRequest = new XMLHttpRequest();
    trackRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            processTracksRequest(JSON.parse(this.response));
        }
    };
    trackRequest.open('GET', api_root + '?method=user.getrecenttracks&limit=1&user=' + user + '&api_key=' + api_key + '&format=json');
    trackRequest.send();
}

function processTracksRequest(response) {

    console.log("processing");

    var trackObject = response.recenttracks.track[0];

    // extract all needed information from the track object
    var trackName = trackObject.name;
    var artistName = trackObject.artist['#text'];
    var albumName = trackObject.album['#text'];
    var imageURL = trackObject.image[2]['#text'] // index 2 because it is a bigger image.

    // construct links to track, artist, album.
    var trackURL = trackObject.url;
    var artistURL = lastfm_root + artistName + '/';
    var albumURL = artistURL + albumName + '/';


    // render this information on the web page
    var title = document.getElementById("title");
    title.target = '_blank';
    title.innerHTML = trackName;
    title.href = trackURL;

    var artist = document.getElementById("artist");
    artist.target = '_blank';
    artist.innerHTML = artistName;
    artist.href = artistURL;

    var album = document.getElementById("album");
    album.target = '_blank';
    album.innerHTML = albumName;
    album.href = albumURL;

    document.getElementById("track-image").src = imageURL;

    //check if the track is now playing, update the icon appropriately
    var icon = document.getElementById("last-listened");
    var nowPlaying = false;
    if (trackObject.hasOwnProperty("@attr")) {
        if (trackObject['@attr'].hasOwnProperty('nowplaying')) {
            // track is currently playing
            nowPlaying = true;
            // set speaker class so that the speaker icon shows to indicate now playing
            icon.className = speaker_class;
            icon.innerHTML = "";
        }
    }

    if (!nowPlaying) {
        // calculate how long since the latest track was scrobbled.
        // fyi the date property of the api response is a unix time stamp.
        var currentUTS = Date.now()/1000; // divide by 1000 so it's in seconds
        var scrobbleUTS = trackObject.date.uts;
        var minutesSinceScrobble = Math.floor((currentUTS - scrobbleUTS) / 60);

        if (minutesSinceScrobble >= 60) {
            icon.innerHTML = Math.floor(minutesSinceScrobble / 60) + "h";
        } else if (minutesSinceScrobble >= (60 * 24)) {
            icon.innerHTML = Math.floor(minutesSinceScrobble / (60 * 24)) + "d";
        } else if (minutesSinceScrobble >= (60*24*30)) {
            icon.innerHTML = Math.floor(minutesSinceScrobble / (60*24*30)) + "mth";
        } else if (minutesSinceScrobble >= (60*24*365)) {
            icon.innerHTML = Math.floor(minutesSinceScrobble / (60*24*365)) + "y";
        } else {
            icon.innerHTML = minutesSinceScrobble + "m";
        }
    }
}

function processAlbumsRequest() {

}
