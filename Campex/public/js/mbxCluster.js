// mapbox cluster map js

mapboxgl.accessToken = mapboxToken;
var map = new mapboxgl.Map({
   container: "cluster-map",
   style: "mapbox://styles/mapbox/dark-v10",
   center: [79.26737318363301, 23.033925006426365],
   zoom: 4,
});

map.on("load", function () {
   // Add a new source from our GeoJSON data and
   // set the 'cluster' option to true. GL-JS will
   // add the point_count property to your source data.
   map.addSource("campgrounds", {
      type: "geojson",
      // Point to GeoJSON data. This example visualizes all M1.0+ campgrounds
      // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
      // data: "https://docs.mapbox.com/mapbox-gl-js/assets/campgrounds.geojson",
      // data formate from above link that mapbox cluster supports:
      // {
      //    "type": "Feature",
      //    "properties": {
      //       "id": "ak16994521",
      //       "mag": 2.3,
      //       "time": 1507425650893,
      //       "felt": null,
      //       "tsunami": 0 },
      //    "geometry": {
      //       "type": "Point",
      //       "coordinates": [ -151.5129, 63.1016, 0.0 ]
      //    }
      // }
      // updating data
      data: campgrounds,

      cluster: true,
      clusterMaxZoom: 8, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
   });

   map.addLayer({
      id: "clusters",
      type: "circle",
      source: "campgrounds",
      filter: ["has", "point_count"],
      paint: {
         // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
         // with three steps to implement three types of circles:
         //   * Blue, 20px circles when point count is less than 100
         //   * Yellow, 30px circles when point count is between 100 and 750
         //   * Pink, 40px circles when point count is greater than or equal to 750
         "circle-color": ["step", ["get", "point_count"], "#ffcdb2", 10, "#ffb4a2", 30, "#e5989b"],
         "circle-radius": ["step", ["get", "point_count"], 20, 10, 25, 30, 30],
      },
   });

   map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "campgrounds",
      filter: ["has", "point_count"],
      layout: {
         "text-field": "{point_count_abbreviated}",
         "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
         "text-size": 12,
      },
   });

   map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "campgrounds",
      filter: ["!", ["has", "point_count"]],
      paint: {
         "circle-color": "#ef476f",
         "circle-radius": 20,
         "circle-stroke-width": 1,
         "circle-stroke-color": "#000000",
      },
   });

   // inspect a cluster on click
   map.on("click", "clusters", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
         layers: ["clusters"],
      });
      var clusterId = features[0].properties.cluster_id;
      map.getSource("campgrounds").getClusterExpansionZoom(clusterId, function (err, zoom) {
         if (err) return;

         map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
         });
      });
   });

   // When a click event occurs on a feature in
   // the unclustered-point layer, open a popup at
   // the location of the feature, with
   // description HTML from its properties.
   map.on("click", "unclustered-point", function (e) {
      // console.log(e.features[0]);
      const {popUpMarkup} = e.features[0].properties;
      // console.log(text);
      var coordinates = e.features[0].geometry.coordinates.slice();

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
   });

   map.on("mouseenter", "clusters", function () {
      map.getCanvas().style.cursor = "pointer";
   });
   map.on("mouseleave", "clusters", function () {
      map.getCanvas().style.cursor = "";
   });
});
