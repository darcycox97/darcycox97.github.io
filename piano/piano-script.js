var CHANNEL_ID = '97darcman';
var API_BASE_URL = 'https://www.googleapis.com/youtube/v3/';
var API_KEY = 'AIzaSyBSdH19KosGvlaxmoXZ5Ra1u3PPRZmZULM';
var VIEWS = 'VIEWS';
var LIKES = 'LIKES';
var DISLIKES = 'DISLIKES';

// load js api client to enable api calls
gapi.load('client', start);
function start() {
    gapi.client.init({'apiKey':API_KEY})
    .then(
         function() {
             // query api for playlist ID of uploads
             return gapi.client.request({
                'path':API_BASE_URL+'channels',
                'params': {
                    'part':'contentDetails',
                    'fields':'items(contentDetails/relatedPlaylists/uploads)',
                    'forUsername':CHANNEL_ID
                }
             })
         }
    )
    .then(
        function(response) {   
            // pass playlist id to scanner method
            var uploadsPlaylist = response.result.items[0].contentDetails.relatedPlaylists.uploads;
            scanPlaylist(uploadsPlaylist);
        },
        function(reason) {
            console.log('errorrrrr');
        }
    );
}

// iterates through videos in the playlist and queries for view counts etc. renders info in the html file
function scanPlaylist(playlistID) {
    
    gapi.client.request({
        'path':API_BASE_URL+'playlistItems',
        'params': {
            'part': 'contentDetails',
            'playlistId': playlistID,
            'fields':'items(contentDetails/videoId)'   
        }
    })
    .then(
        function(response) {
            
            console.log(response.result);
            // iterate through each upload and render information in the webpage
            var videos = response.result.items;
            for (var i = 0; i < videos.length; i++) {
                var videoId = videos[i].contentDetails.videoId;
                renderInfo(videoId, VIEWS);
                renderInfo(videoId, LIKES);
                renderInfo(videoId, DISLIKES);   
            }

        },
        function(error) {
            console.log("Error fetching uploads from playlist");
        }
    
    
    );
}

// info can be either VIEWS, LIKES, or DISLIKES
function renderInfo(videoID, info) {
    
    var fields = "";
    if (info === VIEWS) {
        fields = 'items(id,statistics/viewCount)';
    } else if (info === LIKES) {
        fields = 'items(id,statistics/likeCount)';
    } else {
        // DISLIKES
        fields = 'items(id,statistics/dislikeCount)';
    }
    
    gapi.client.request({
        'path':API_BASE_URL+'videos',
        'params':
        {
            'part':'statistics,id',
            'fields': fields,
            'id':videoID
        }
    }).then(
        function(response) {
            var stats = response.result.items[0].statistics; // need to append view/likes/dislikes
            var id = response.result.items[0].id;
            if (info === VIEWS) {
                $(".views." + id).text(stats.viewCount);
            } else if (info === LIKES) {
                $(".likes." + id).text(stats.likeCount);
            } else {
                $(".dislikes." + id).text(stats.dislikeCount);
            }
        },
        function(reason) {
            console.log(reason);
            console.log("error calculating statistics")
        }
    );
}


// query youtube api for all uploaded videos from Datty Plays, store the id's.



// Go through each id in the declared list (represents each video on the webpage).
for (var i=0; i < 4; i++) {
    
    // query statistics info from the youtube api and access view count, likes, dislikes.
    
    
    // search for the html classes "views, likes, dislikes" and match with the current id.
    
}

