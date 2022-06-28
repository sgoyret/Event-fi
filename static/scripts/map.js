window.addEventListener('load', function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGlla2thbiIsImEiOiJjbDFucDY1ZWcwZDg4M2xtanM1ajAxdmw0In0.qWC1IZvfYRzjMzuRqPcbwQ';
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [-56.0797027522, -34.7892933233], // starting position [lng, lat]
    zoom: 16 // starting zoom
    });
});
map.on('load', function() {
    // Add geolocate control to the map.
  map.addControl(
      new mapboxgl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true
}   
})
  )
  map.resize()
})/*,
  // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
  // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
  })
  );

  /*var geojson = {
    type: 'FeatureCollection',
    features: []
  };
  var request = new XMLHttpRequest();
  request.open('GET', 'http://192.168.1.21:5000/events/');
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Access-Control-Allow-Origin', '*');
  request.setRequestHeader('Access-Control-Allow-Headers', '*');
  request.send();
    request.onload = function(_callback) {
        var data = JSON.parse(request.responseText);
        for (let i = 0; i < data.length; i++) {
            const coordinates = data[i].coordinates.split(',');
            geojson.features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    
                    coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
                },
                properties: {
                    id: data[i]._id
                }
            });
        };
       /* geojson.features.forEach(function(marker) {
          // create a HTML element for each feature
          var el = document.createElement('div');
          el.classList.add('marker');
          el.addEventListener("click", function() {
            var request = new XMLHttpRequest();
            request.open('GET','127.0.0.1:5000/events/' + marker.properties.id);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', '*');
            request.send();
            request.onload = function() {
                var data = JSON.parse(request.responseText);
                console.log(data);
                const element = document.getElementById('wraper');
                let new_div = document.createElement('div');
                new_div.classList.add('popup');
                new_div.setAttribute ('id', 'popup');
                element.appendChild(new_div);
                new_div.innerHTML += '<div class="close" id="closepopup"> </div>' +
                "<div class='eventitle'>" + data.title + "</div>" +
                "<div class='eventimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>"
                + "<div class='eventime'>" + data.date + "</div>"
                + "<div class='eventlocation'>" + data.coordinates + "</div>"
                + "<div class='eventdesc'>" + data.description + "</div>"
                + "<div class='tofav'> Anadir a Favoritos </div>"
                + "</div>"
                const close = document.getElementById('closepopup');
                close.addEventListener("click", function() {
                    new_div.remove();
                });
            }; 
          });
          // make a marker for each feature and add it to the map
          new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
              .addTo(map);
        }); */