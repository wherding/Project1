function displayReviews(reviews, movieDetails) {
    reviews.forEach(review => {
        let p = $('<p>' + review.Source + ': ' + review.Value + '</p>');
        movieDetails.append(p)
    })
}

function omdbCall(movieTitle, movieDetails, callback) {
    let omdbKey = 'a34a6a5f';
    $.ajax({
        url: 'https://www.omdbapi.com/?apikey=' + omdbKey + '&t=' + movieTitle,
        method: 'GET'
    })
        .then(res => {
            callback(res.Ratings, movieDetails);

        })
};

function getPopularTitles() {
    let popularTitles = db.ref('/search/').orderByValue().limitToLast(3);
    let arr;
    popularTitles.once('value')
        .then(snap => {
            snap.forEach(snap => {
                let btn = $('<button class="btn-large ligth popular-movie">' + snap.key + '</button>');
                $('.popularMovies').append(btn);
            })
        });
};

function displayTracks(tracks) {
    tracks.forEach(track => {
        let row = $('<tr>');

        let audioTableData = $('<tr>');
        let audioElement = $('<audio controls></audio>');
        let audioSource = $('<source>');
        audioSource.attr('src', track.previewUrl);
        audioSource.attr('type', 'audio/mpeg');

        let songName = $('<td>' + track.trackName + '</td>');
        let artistName = $('<td>' + track.artistName + '</td>');

        audioElement.append(audioSource);
        audioTableData.append(audioElement);
        row.append(songName, artistName, audioTableData);
        $('#tracks').append(row);
    });
};

function iTunesCall(movieTitle) {
    $.ajax({
        url: 'https://itunes.apple.com/search?term=' + movieTitle + '&media=movie&entity=album&limit=10',
        method: 'GET',
        dataType: 'jsonp'
    })
        .then(res => {
            let albumId = res.results[0].collectionId;

            $.ajax({
                url: 'https://itunes.apple.com/lookup?id=' + albumId + '&entity=song',
                method: 'GET',
                dataType: 'jsonp'
            })
                .then(res => {
                    $('#tracks').empty();
                    let tracks = res.results.slice(1, res.results.length);
                    displayTracks(tracks);
                })
        })
}

function addSearchToFirebase(movieTitle) {
    let db = firebase.database();
    let movieRef = db.ref('/search/' + movieTitle);

    movieRef.once('value')
        .then(snap => {
            if (snap.exists()) {
                let hits = snap.val() + 1;
                movieRef.set(hits);
            }
            else
                movieRef.set(1);
        })
}

function getCast(cast) {
    for (let i = 0; i < 10; i++) {
        let newElement = $('<p>');
        newElement.text(cast[i].name);
        $('#movie-details-space').append(newElement);
    };
}