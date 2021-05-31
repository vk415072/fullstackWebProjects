// mapbox GL JS

mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
   container: "map",
   style: "mapbox://styles/mapbox/streets-v11",
   // center: [99.812438, 30.9388],
   center: campground.geometry.coordinates,
   zoom: 9,
});

// adding marker
new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).addTo(map);
