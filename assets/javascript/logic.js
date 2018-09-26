$(document).ready(function () {

    var movieObject = {};
    getPopularTitles();

    $(document).on('search', '#search', function (event) {
        let movieTitle = $('#search').val();
        fullSearch(movieTitle, movieObject);
        $('movie-details-space').text(movieObject.synopsis);
        $('#search').val('');
    });

    $(document).on('search', '#side-search', function(event){
        let movieTitle = $('#side-search').val();
        fullSearch(movieTitle, movieObject);
        $('movie-details-space').text(movieObject.synopsis);
        $('#side-search').val('');
    })


    $('.movie-snippet').on('click', function () {
        let iconValue = $(this).attr('value');
        let displayArea = $('#movie-details-space');
        displayArea.empty();
        InfoSwitch(iconValue, displayArea, movieObject);
    })

    $('.modal').modal();
    $(document).on('click', '#alt-movies-btn', function () {
        let displayArea = $('#alt-movies-card-area');
        displayAlternateMovies(movieObject.alternateMovies, displayArea);
    });

    $(document).on('click', '.alt-movie-button', function () {
        let movieTitle = $(this).val();
        fullSearch(movieTitle, movieObject);
        $('.modal').modal('close');
        $('#search').val('');
    });

    $(document).on('click', '.popular-movie', function () {
        let movieTitle = $(this).text();
        
        fullSearch(movieTitle, movieObject);
    });

    $(document).on('click', '.play-song', function () {

        let song = $('#' + $(this).attr('value'));
        song = song.get(0);

        if ($(this).attr('data-status') === 'paused') {

            let album = $('.play-song');
            for (let i = 0; i < album.length; i++) {
                if (album[i].getAttribute('data-status') === 'playing') {
                    album[i].setAttribute('data-status', 'paused');
                    album[i].textContent = 'play_circle_outline';
                    let audio = $('#' + (i + 1));
                    audio = audio.get(0);
                    audio.pause();
                }
            }

            song.play();
            $(this).text('pause_circle_outline');
            $(this).attr('data-status', 'playing');
        }
        else {
            song.pause()
            $(this).text('play_circle_outline');
            $(this).attr('data-status', 'paused');
        }
    })
})