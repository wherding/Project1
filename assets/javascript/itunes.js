$(document).ready(function () {

    $('#search').on('keypress', function(event){

        if(event.which === 13) {

            let searchTerm = $('#search').val();
            console.log('Search: ' + searchTerm);
            $('#tracks').empty();

            $.ajax({
                url: 'https://itunes.apple.com/search?term=' + searchTerm + '&media=movie&entity=album&limit=10',
                method: 'GET'
            })
                .then(function (res) {
                    res = JSON.parse(res);
                    console.log(res.results[0]);
                    
                    // let img = $('<img>');
                    // img.attr('src', res.results[0].artworkUrl60);
                    // img.attr('alt', res.results[0].collectionName);
                    // $('#soundtrack-card').append(img);

                    let albumId = res.results[0].collectionId;

                    $.ajax({
                        url: 'https://itunes.apple.com/lookup?id=' + albumId + '&entity=song',
                        method: 'GET'
                    })
                    .then(function(res){
                        res = JSON.parse(res);
                        console.log(res);
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
        }
    });


});