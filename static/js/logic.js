// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data.features);
    // createFeatures(data.features)

    // function createFeatures()
    // store lat and long 
    var long = data.features.map(d => d.geometry.coordinates[0])
    var lat = data.features.map(d => d.geometry.coordinates[1])

    // store magnitude, place and date
    var magnitude = data.features.map(d => d.properties.mag)
    var places = data.features.map(d => d.properties.place)
    var date = data.features.map(d => Date(d.properties.time))

    // create a map and center it West coast
    var myMap = L.map("map", {
        center: [38.80, -116.41],
        zoom: 6
    });
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    }).addTo(myMap);

    // create data points
    var circleColors= ["lime", "greenyellow", "gold", "orange", "darkorange", "red"]
    var sizeRanges= [0,1,2,3,4,5]

    for (var i = 0; i < places.length; i++) {
        var color = "";
        if (magnitude[i] > sizeRanges[5]) {
            color =circleColors[5];
        }
        else if (magnitude[i] >= sizeRanges[4]) {
            color = circleColors[4];
        }
        else if (magnitude[i] >= sizeRanges[3]) {
            color = circleColors[3];
        }
        else if (magnitude[i] >= sizeRanges[2]) {
            color = circleColors[2];
        }
        else if (magnitude[i] >= sizeRanges[1]) {
            color = circleColors[1];
        }
        else {
        color = circleColors[0];
        } 
        L.circle([lat[i],long[i]], {
            fillOpacity: 1,
            color: "black",
            fillColor: color,
            weight: 0.5,
            radius: magnitude[i]*10000
        }).bindPopup("<h2>" + places[i] + "</h2><hr><ul><li>" + date[i] + "</li><li>Magnitude: " + magnitude[i] + "</li>").addTo(myMap);
    }

    // // Add legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = sizeRanges,
        colors = circleColors;
        
        // Loop through our intervals and generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<div class='legend-entry' style='background: " + colors[i] + "'> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+" + "</div>");
        }
        return div;
    };
    legend.addTo(myMap);
});