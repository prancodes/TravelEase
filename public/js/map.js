// Displaying map on webpage
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates,
    zoom: 14
});

// adding Marker on map
const marker = new mapboxgl.Marker({color : "#fe424d"})
.setLngLat(coordinates)
.addTo(map);

