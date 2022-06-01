mapboxgl.accessToken = 'pk.eyJ1IjoiZGlla2thbiIsImEiOiJjbDFucDY1ZWcwZDg4M2xtanM1ajAxdmw0In0.qWC1IZvfYRzjMzuRqPcbwQ';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/diekkan/cl3uie8cy005r14o87c0e3azh', // style URL
    center: [-56.0797027522, -34.7892933233], // starting position [lng, lat]
    zoom: 16 // starting zoom
});
// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
    },
// When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
// Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
})
);
var geojson = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-56.07854247093201,
            -34.78871729652251]
        },
        'properties': {
          'title': 'Fiestita en HBTN',
          'description': 'Ciudad de San Salvador, El Salvador'
          }
        },
        {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-56.079561710357666,
            -34.78933848243201]
        },
        'properties': {
          'title': 'Fiestita en Regency',
          'description': 'que demas pibe'
        }
      }
    ]
  };
  geojson.features.forEach(function(marker) {
    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add it to the map
    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
  });