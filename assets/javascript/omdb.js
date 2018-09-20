$(document).ready(function () {

    var movieInfo;


    $('#search').on('keypress', function (event) {
        if (event.which == '13') {
            let key = 'a34a6a5f';
            let title = $(this).val();

            let query = 'http://www.omdbapi.com/?apikey=' + key + '&t=' + title;
            $.ajax({
                url: query,
                method: 'GET'
            })
                .then(function (res) {
                    movieInfo = res;
                    let synopsis = $('<p>');
                    synopsis.text(res.Plot);
                    $('#movie-details-space').empty();
                    $('#movie-details-space').append(synopsis);
                    $('#poster').attr('src', res.Poster)
                    $('#movie-details-title').html('<strong>Synopsis</strong>');
                });
        }
    })

    $('.movie-snippet').on('click', function (e) {
        switch ($(this).attr('value')) {
            case 'cast':
                $('#movie-details-space').empty();
                let actors = movieInfo.Actors.split(',');
                actors.forEach(actor => {
                    let actorElement = $('<p>' + actor + '</p>');
                    $('#movie-details-space').append(actorElement);
                    $('#movie-details-title').html('<strong>Cast</strong>');
                })
                break;
            case 'synopsis':
                $('#movie-details-space').empty();
                let synopsisElement = $('<p>' + movieInfo.Plot + '</p>');
                $('#movie-details-space').append(synopsisElement);
                $('#movie-details-title').html('<strong>Synopsis</strong>');
                break;
            case 'reviews':
                $('#movie-details-space').empty();
                movieInfo.Ratings.forEach(rating => {
                    let ratingElement = $('<p>' + rating.Source + ': ' + rating.Value + '</p>');
                    $('#movie-details-space').append(ratingElement);
                });
                $('#movie-details-title').html('<strong>Reviews</strong>');
                break;
        }
    });






});