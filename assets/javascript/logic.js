$(document).ready(function () {

    var movieObject = {};
    getPopularTitles();

    $('#search').on('search', function (event) {
        movieTitle = $('#search').val();
        fullSearch(movieTitle, movieObject);
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

    $('.modal').modal();
    $('#alt-movies-btn').on('click', function(){
        let displayArea = $('#alt-movies-card-area');
        displayAlternateMovies(alternateMovies, displayArea);
    });


})