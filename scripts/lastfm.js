var api_key = 'b5d98464c82acbabb4ee727c9b683d7d';
var user = 'darcycox97';
var api_root = 'http://ws.audioscrobbler.com/2.0/';
var lastfm_root = 'https://www.last.fm/music/';
var speaker_class = 'glyphicon glyphicon-volume-up';

var album_class = "album-cover";
var link_class = "album-link";
var hover_class = "album-animation";
var text_container_class = "text-container";
var info_wrapper_class = "album-info-wrapper";
var info_class = "album-info";
var info_text_class = "album-info-text";

$("document").ready(function() {

    // make the initial request
    sendRecentTracksRequest();
    window.setInterval(sendRecentTracksRequest, 10000); // resend the request every 10 sec.

    // request albums
    var albumsRequest = new XMLHttpRequest();
    albumsRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            processAlbumsRequest(JSON.parse(this.response));
        }
    };

    albumsRequest.open("GET", api_root + "?method=user.gettopalbums&period=3month&user=" + user + "&api_key=" + api_key + "&format=json")
    albumsRequest.send();

});


// sends a new request for the recent track
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


// processes info about the most recent track and renders it in the page.
function processTracksRequest(response) {

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
        icon.className = "";
        var currentUTS = Date.now()/1000; // divide by 1000 so it's in seconds
        var scrobbleUTS = trackObject.date.uts;
        var minutesSinceScrobble = Math.floor((currentUTS - scrobbleUTS) / 60);

        if (minutesSinceScrobble >= 60) {
            icon.innerHTML = Math.floor(minutesSinceScrobble / 60) + "h ago";
        } else if (minutesSinceScrobble >= (60 * 24)) {
            icon.innerHTML = Math.floor(minutesSinceScrobble / (60 * 24)) + "d ago";
        } else if (minutesSinceScrobble >= (60*24*30)) {
            icon.innerHTML = Math.floor(minutesSinceScrobble / (60*24*30)) + "mth ago";
        } else if (minutesSinceScrobble >= (60*24*365)) {
            icon.innerHTML = Math.floor(minutesSinceScrobble / (60*24*365)) + "y ago";
        } else {
            icon.innerHTML = minutesSinceScrobble + "m ago";
        }
    }
}

// loads the album cover grid based on the api response when top albums is requested.
function processAlbumsRequest(response) {

    var container = document.getElementById("album-collage");
    var albums = response.topalbums.album;

    // loop through all albums and render them in the div specified by id "album-collage".
    for (var i = 0; i < albums.length; i++) {
        var album = albums[i];
        var imageURL = album.image[2]['#text'];

        // create the album-cover.
        var cover = document.createElement("div");
        cover.className = album_class;
        cover.style.backgroundImage = "url('" + imageURL + "')";

        // construct the text div to overlay it and append it to the cover div.
        var textDiv = constructAlbumTextDiv(album);

        cover.appendChild(textDiv);
        container.appendChild(cover);
    }
}


// helper to create the div that will be added to the album-cover, holding info about the album.
function constructAlbumTextDiv(albumObj) {
    var artistName = albumObj.artist.name;
    var albumName = albumObj.name;
    var plays = albumObj.playcount;
    var albumLink = albumObj.url;

    var info = document.createElement("div");
    info.className = info_class;

    var infoText = document.createElement("div");
    infoText.className = info_text_class;
    info.appendChild(infoText);

    var textWrapper = document.createElement("div");
    textWrapper.className = info_wrapper_class;
    textWrapper.appendChild(info);

    var titleEl = document.createElement("h5");
    titleEl.appendChild(document.createTextNode(albumName));
    infoText.appendChild(titleEl);

    var artistEl = document.createElement("h5");
    artistEl.appendChild(document.createTextNode(artistName));
    infoText.appendChild(artistEl);

    var playCountEl = document.createElement("h5");
    playCountEl.appendChild(document.createTextNode("Plays: " + plays));
    infoText.appendChild(playCountEl);

    var textContainer = document.createElement("div");
    textContainer.className = text_container_class;
    textContainer.appendChild(textWrapper);

    // make the album cover into a link
    var albumLinkElement = document.createElement("a");
    albumLinkElement.href = albumLink;
    albumLinkElement.target = '_blank';
    var linkSpan = document.createElement("span");
    linkSpan.className = link_class;
    albumLinkElement.append(linkSpan);
    textContainer.appendChild(albumLinkElement);

    return textContainer;
}
