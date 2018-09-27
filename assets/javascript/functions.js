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
            //janky fix
            $('#movie-details-space').empty();
            callback(res.Ratings, movieDetails);
        })
};

function getPopularTitles() {
//     let btn = $("<button>");
//    // btn.addClass("popular-movie")
//     btn.addClass("waves-effect waves-light btn");
//     btn.text("Popular Searches:")
//     let li = $("<li>");
//     li.append(btn);
//     $('.tabs').append(li);
//     var nli =  {}
//                 nli = li.clone();
//                 $('#side-nav').append(nli);

    let db = firebase.database();
    let popularTitles = db.ref('/search/').orderByValue().limitToLast(3);
    popularTitles.once('value')
        .then(snap => {
            snap.forEach(snap => {
                let btn = $("<button>");
                btn.addClass("popular-movie")
                btn.addClass("waves-effect waves-light btn")
                btn.text(snap.key)
                let li = $("<li>");
                li.append(btn);
                $('.tabs').append(li);
                var nli =  {}
                nli = li.clone();
                nli.addClass('sidenav-popular-movie')
                $('#side-nav').append(nli);
            })
        });
};

function displayTracks(tracks) {
    let i = 1;
    tracks.forEach(track => {
        let row = $('<tr>');

        let audioTableData = $('<td>');
        let audioElement = $('<audio id="' + i + '"></audio>');
        let audioSource = $('<source>');

        audioSource.attr('src', track.previewUrl);
        audioSource.attr('type', 'audio/mpeg');

        let playButton = $('<td><button class="material-icons play-song" data-status="paused" value="' + i + '">play_arrow</button></td>');
        let songName = $('<td>' + track.trackName + '</td>');
        let artistName = $('<td>' + track.artistName + '</td>');

        audioElement.append(audioSource);
        audioTableData.append(audioElement);
        row.append(songName, artistName, audioTableData, playButton);
        $('#tracks').append(row);
        i++;
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
};

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
};

function getCast(cast) {
    for (let i = 0; i < 10; i++) {
        let newElement = $('<p>');
        newElement.text(cast[i].name);
        $('#movie-details-space').append(newElement);
    };
};

function displayAlternateMovies(alternateMovies, displayArea) {
    displayArea.empty();
    alternateMovies.forEach(movie => {
        let card = $('<div class="card alt-movie-card"></div>');
        let img = $('<div class="card-image img-left"><img class="alt-movie-img" src="https://image.tmdb.org/t/p/w500/' + movie.poster_path + '"></div>');
        let content = $('<div class="content-right"><p>' + movie.overview + '</p><button class="alt-movie-button btn light" value="' + movie.original_title + '">Choose this title</button></div>');
        let clearDiv = $('<div class="clear-div"></div>');
        card.append(img, content);
        displayArea.append(card, clearDiv);
    });
};

function displayBackgrounds(movieObject) {
    let first = movieObject.gallery[0].file_path;
    let middle = movieObject.gallery[(Math.floor(movieObject.gallery.length / 2))].file_path;
    let last = movieObject.gallery[(movieObject.gallery.length - 1)].file_path;

    $('#bg-1').attr('src', 'https://image.tmdb.org/t/p/original' + first);
    $('#bg-1').attr('data-value', 0);
    $('#bg-2').attr('src', 'https://image.tmdb.org/t/p/original' + middle);
    $('#bg-2').attr('data-value', (Math.floor(movieObject.gallery.length / 2)));
    $('#bg-3').attr('src', 'https://image.tmdb.org/t/p/original' + last);
    $('#bg-3').attr('data-value', (movieObject.gallery.length - 1));
};
///////////////working here//////////////////
function backgroundCrossFade(gallery, currentIndex, backgroundElement){
    if(currentIndex == (gallery.length - 1)){
        currentIndex = -1;
    }
    currentIndex++;
    let imgUrl = 'https://image.tmdb.org/t/p/original' + gallery[currentIndex].file_path;
    
    backgroundElement.animate({opacity: 0}, 1200);
    setTimeout(function(){
        backgroundElement.attr('src', imgUrl);
    }, 1150);
    backgroundElement.animate({opacity: 1}, 1200);
    backgroundElement.attr('data-value', currentIndex);
}

function fullSearch(movieTitle, movieObject) {
    let key = '2adc170b69082ad840069650a7c752fc';
    let query = 'https://api.themoviedb.org/3/search/movie?api_key=' + key + '&query=' + movieTitle;

    $.ajax({
        url: query,
        method: 'GET'
    })
        .then(res => {
            movieObject.alternateMovies = res.results.slice(1, 6 || (res.results.length - 1));

            let newQuery = 'https://api.themoviedb.org/3/movie/' + res.results[0].id + '?api_key=' + key + '&append_to_response=credits,reviews,videos,images';

            $.ajax({
                url: newQuery,
                method: 'GET'
            })
                .then(res => {
                    movieObject.synopsis = res.overview;
                    movieObject.runTime = res.runtime;
                    movieObject.cast = res.credits.cast;
                    movieObject.movieTitle = res.original_title;
                    movieObject.genres = res.genres;
                    movieObject.gallery = res.images.backdrops;

                    
                    displayBackgrounds(movieObject);
                    addSearchToFirebase(movieObject.movieTitle);
                    iTunesCall(movieObject.movieTitle);
                    if(movieObject.interval)
                        clearInterval(movieObject.interval);

                        movieObject.interval = setInterval(function(){
                        let bgOne = $('#bg-1');
                        let bgTwo = $('#bg-2');
                        let bgThree = $('#bg-3');
                        backgroundCrossFade(movieObject.gallery, bgOne.attr('data-value'), bgOne);
                        backgroundCrossFade(movieObject.gallery, bgTwo.attr('data-value'), bgTwo);
                        backgroundCrossFade(movieObject.gallery, bgThree.attr('data-value'), bgThree);
                    }, 10000)

                    $('#title').hide();

                })
        })
};

function displayInfo(movieObject, selectedInfo) {
    let displayArea = $('movie-details-space');
    displayArea.empty();

};

function displayGallery(gallery, displayArea) {
    console.log($('.carousel').length);
    let slideShow = $('<div class="carousel carousel-slider data-indicators="true"></div>');
    let indicators = $(
        '<div class="carousel-fixed-item center middle-indicator"><div class="left"><a href="#" class="movePrevCarousel middle-indicator-text waves-effect waves-light content-indicator"><i class="chevron material-icons left middle-indicator-text">chevron_left</i></a></div><div class="right"><a href="#" class="moveNextCarousel middle-indicator-text waves-effect waves-light content-indicator"><i class="chevron material-icons right middle-indicator-text">chevron_right</i></a></div></div>"'
    );
    slideShow.append(indicators);
    gallery.forEach(image => {
        let item = $('<a class="carousel-item" href="#"><img class="carousel-image" src="https://image.tmdb.org/t/p/original/' + image.file_path + '" /></a>');        
        slideShow.append(item);
    });
    displayArea.append(slideShow);
    $('.carousel.carousel-slider').carousel({ fullWidth: true });
};

function displayGenres(genres, displayArea) {
    genres.forEach(genre => {
        let p = $('<p>' + genre.name + '</p>');
        displayArea.append(p);
    })
}

function InfoSwitch(iconValue, displayArea, movieObject) {
    if (movieObject.cast === undefined) {
        displayArea.text('Please search for a movie to see these results');
    }
    else {
        switch (iconValue) {
            case 'synopsis':
                displayArea.text(movieObject.synopsis);
                break;
            case 'cast':
                getCast(movieObject.cast);
                break;
            case 'gallery':
                displayGallery(movieObject.gallery, displayArea);
                break;
            case 'genre':
                displayGenres(movieObject.genres, displayArea);
                break;
            case 'rating':
                omdbCall(movieObject.movieTitle, displayArea, displayReviews);
                break;
            case 'runtime':
                displayArea.text(movieObject.runTime + ' minutes');
        }
    }
}
