$(document).ready(function () {

    var movieObject = {};
    getPopularTitles();

    $(document).on('search', '#search', function (event) {
        let movieTitle = $('#search').val();
        fullSearch(movieTitle, movieObject);
        $('movie-details-space').text(movieObject.synopsis);
     });


    $('.movie-snippet').on('click', function () {
        let iconValue = $(this).attr('value');
        let displayArea = $('#movie-details-space');
        displayArea.empty();
        InfoSwitch(iconValue, displayArea, movieObject);
    })

    $('.modal').modal();
    $(document).on('click', '#alt-movies-btn', function(){
        console.log(movieObject);
        let displayArea = $('#alt-movies-card-area');
        displayAlternateMovies(movieObject.alternateMovies, displayArea);
    });

    $(document).on('click', '.alt-movie-button', function(){
        let movieTitle = $(this).val();
        fullSearch(movieTitle, movieObject);
        $('.modal').modal('close');
        $('#search').val('');
    });

    $(document).on('click', '.popular-movie', function(){
        let movieTitle = $(this).text();
       // console.log($(this).text())
        fullSearch(movieTitle, movieObject);
        //$('.modal').modal('close');
        //$('#search').val('');
    });

})