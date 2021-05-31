// mapbox GL JS

mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
   container: "map",
   style: "mapbox://styles/mapbox/streets-v11",
   center: [76.812438, 29.9388],
   zoom: 4,
});
