$(document).ready(function () {
    var db = firebase.database();

    var synopsis;
    var cast = [];
    var releaseDate;
    var runTime;
    var posterUrl;
    var gallery = [];
    var trailerUrl;
    var movieTitle

    $('#search').on('keypress', function (event) {
        if (event.which === 13) {
            let key = '2adc170b69082ad840069650a7c752fc';
            movieTitle = $(this).val();

            let query = 'https://api.themoviedb.org/3/search/movie?api_key=' + key + '&query=' + movieTitle;

            $.ajax({
                url: query,
                method: 'GET'
            })
                .then(function (res) {
                    console.log('First');
                    console.log(res);
                    $.ajax({
                        url: 'https://api.themoviedb.org/3/movie/' + res.results[0].id + '?api_key=' + key + '&append_to_response=credits,reviews,videos,images',
                        method: 'GET'
                    })
                        .then(function (res) {
                            console.log('Second');
                            console.log(res);
                            posterUrl = 'https://image.tmdb.org/t/p/w500/' + res.images.posters[0].file_path;
                            synopsis = res.overview;
                            $('#movie-details-space').empty();
                            $('#movie-details-space').append($('<p>' + synopsis + '</p>'));
                            releaseDate = res.release_date;
                            runTime = res.runtime;
                            gallery = res.images.backdrops;
                            trailerUrl = res.videos.results[0].id;
                            cast = res.credits.cast;
                            movieTitle = res.original_title;
                            $('#poster').attr('src', 'https://image.tmdb.org/t/p/original/' + res.poster_path);

                            //Add search to firebase 'searches' path

                            let db = firebase.database();

                            let movieRef = db.ref('/search/' + movieTitle);

                            movieRef.once('value').then(snap => {
                                if (snap.exists()) {
                                    let hits = snap.val() + 1;
                                    movieRef.set(hits)
                                }
                                else {
                                    movieRef.set(1)
                                }

                                var pop = db.ref('/search/').orderByValue();
                                pop.once('value')
                                    .then(function (snap) {
                                       snap.forEach(movie =>{
                                           console.log(movie.key + ', ' + movie.val());
                                       })
                                    })
                            })


                        });

                    //itunes call based on returned movie info:
                    $.ajax({
                        url: 'https://itunes.apple.com/search?term=' + movieTitle + '&media=movie&entity=album&limit=10',
                        method: 'GET'
                    })
                        .then(function (res) {
                            res = JSON.parse(res);

                            let albumId = res.results[0].collectionId;

                            $.ajax({
                                url: 'https://itunes.apple.com/lookup?id=' + albumId + '&entity=song',
                                method: 'GET'
                            })
                                .then(function (res) {
                                    $('#tracks').empty();

                                    res = JSON.parse(res);
                                    let tracks = res.results.slice(1, res.results.length);

                                    tracks.forEach(track => {
                                        let row = $('<tr>');
                                        let audioTableData = $('<td>');
                                        let audioElement = $('<audio controls></audio>');
                                        let audioSource = $('<source>');
                                        audioSource.attr('src', track.previewUrl);
                                        audioSource.attr('type', 'audio/mpeg');

                                        let song = $('<td>' + track.trackName + '</td>');
                                        let artist = $('<td>' + track.artistName + '</td>');

                                        audioElement.append(audioSource);
                                        audioTableData.append(audioElement);
                                        row.append(song, artist, audioTableData);
                                        $('#tracks').append(row);
                                        $('#search').val('');
                                    })

                                })
                        })

                });

        }
    });



    function getCast() {
        $('#movie-details-space').empty();
        for (let i = 0; i < 10; i++) {
            let newElement = $('<p>');
            //console.log(actorElement.text());
            newElement.text(cast[i].name);
            $('#movie-details-space').append(newElement);
        };
    }

    $('.movie-snippet').on('click', function () {
        let linkValue = $(this).attr('value');
        let movieDetails = $('#movie-details-space');

        switch (linkValue) {
            case 'synopsis':
                movieDetails.text(synopsis);
                break;
            case 'cast':
                getCast();
                break;

        }

    })
})