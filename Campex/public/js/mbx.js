// mapbox GL JS

mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
   container: "map",
   style: "mapbox://styles/mapbox/dark-v10",
   // center: [99.812438, 30.9388],
   center: campground.geometry.coordinates,
   zoom: 9,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// adding marker & map popup
new mapboxgl.Marker()
   .setLngLat(campground.geometry.coordinates)
   .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`))
   .addTo(map);
