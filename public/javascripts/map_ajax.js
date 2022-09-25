$(document).ready ( function() {
    const mymap = L.map('displaymap').setView([51.505, -0.09], 13);

    console.log("hello");

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoia3doaXRlNiIsImEiOiJjbDJhdXhndTQwMGc3M2JvZHZzaDdycHN2In0.7ABhNIpSMIP9RYBurLU8ug'
    }).addTo(mymap);

    //var tableInfo = $('#contacttab').data();

    //mymap.flyTo([ tableInfo.fields[0].latitude, tableInfo.fields[0].longitude ], 8);

    /*for (var i = 0; i < tableInfo.fields.length; i++) {
        L.marker([ tableInfo.fields[i].latitude, tableInfo.fields[i].longitude  ]).addTo(mymap);
    }*/

    $('tr.content').each(function() {
        let tableEntry = $(this).data();
        L.marker([ tableEntry.fields.latitude, tableEntry.fields.longitude ]).addTo(mymap);
    })

    $(document).on('click','.content', function () {
        let tableEntry = $(this).data();
        mymap.flyTo([ tableEntry.fields.latitude, tableEntry.fields.longitude ], 8);
    });

});