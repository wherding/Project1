$(document).ready(function () {
    var db = firebase.database();

    var synopsis;
    var cast = [];
    var runTime;
    var trailerUrl;
    var gallery;
    var movieTitle
    var genre;

    //Display the 3 top searches
    getPopularTitles();


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
                    //console.log('First');
                    //console.log(res);
                    $.ajax({
                        url: 'https://api.themoviedb.org/3/movie/' + res.results[0].id + '?api_key=' + key + '&append_to_response=credits,reviews,videos,images',
                        method: 'GET'
                    })
                        .then(function (res) {
                            //console.log('TMDB Second');
                            //console.log(res);
                            posterUrl = 'https://image.tmdb.org/t/p/w500/' + res.images.posters[0].file_path;
                            synopsis = res.overview;
                            $('#movie-details-space').empty();
                            $('#movie-details-space').append($('<p>' + synopsis + '</p>'));
                            runTime = res.runtime;
                            trailerUrl = res.videos.results[0].id;
                            cast = res.credits.cast;
                            movieTitle = res.original_title;
                            genre = res.genres;
                            gallery = res.images.backdrops;
                            $('#bg-1').attr('src', 'https://image.tmdb.org/t/p/original/' + res.images.backdrops[0].file_path);
                            $('#bg-2').attr('src', 'https://image.tmdb.org/t/p/original/' + res.images.backdrops[(Math.floor(res.images.backdrops.length / 2))].file_path);
                            $('#bg-3').attr('src', 'https://image.tmdb.org/t/p/original/' + res.images.backdrops[(res.images.backdrops.length - 1)].file_path);

                            //reviews = omdbCall(movieTitle);
                            addSearchToFirebase(movieTitle);
                            iTunesCall(movieTitle);

                        });



                });

        }
    });







    $('.movie-snippet').on('click', function () {
        let linkValue = $(this).attr('value');
        let movieDetails = $('#movie-details-space');
        movieDetails.empty();

        switch (linkValue) {
            case 'synopsis':
                movieDetails.text(synopsis);
                break;
            case 'cast':
                getCast(cast);
                break;
            case 'gallery':
                let slideshow = $('<div class="carousel carousel-slider"></div>');
                gallery.forEach(img => {
                    let item = $('<a class="carousel-item" href="#"><img src="https://image.tmdb.org/t/p/original/' + img.file_path + '"></a>');
                    //console.log(img.file_path);
                    slideshow.append(item);
                    movieDetails.append(slideshow);
                    $('.carousel.carousel-slider').carousel({ fullWidth: true });
                })
                break;
            case 'genre':
                genre.forEach(genre => {
                    let p = $('<p>');
                    p.text(genre.name);
                    movieDetails.append(p);
                })
                break;
            case 'rating':
                omdbCall(movieTitle, movieDetails, displayReviews);
                break;
            case 'runtime':
                movieDetails.text(runTime + ' minutes');
                break;


        }

    })
})