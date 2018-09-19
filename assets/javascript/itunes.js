$(document).ready(function () {

    $('#search').on('keypress', function(event){

        if(event.which === 13) {

            let searchTerm = $(this).val();

            $.ajax({
                url: 'https://itunes.apple.com/search?term=' + searchTerm + '&entity=album',
                method: 'GET'
            })
                .then(function (res) {
                    res = JSON.parse(res);
                    console.log(res);
                })
        }
    });


});