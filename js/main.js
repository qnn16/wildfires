mapboxgl.accessToken = 'pk.eyJ1IjoicW5uIiwiYSI6ImNsdDNxYzh2YjF6N2EybHBwZHM2endwZnAifQ.Vf6vwhN46xhlkDOdRz1Mew';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 6.25, // starting zoom
    minZoom: 6.25,
    center: [-121.6565, 47.4114],
});

map.on('load', () => {
    // Add your wildfire data source and layer here
    // Replace 'YOUR_GEOJSON_URL' with the actual URL to your wildfire GeoJSON data
    map.addSource('wildfires', {
        type: 'geojson',
        data: 'assets/fires-1973-2022.geojson'
    });

    map.addLayer({
        id: 'wildfire-layer',
        type: 'fill',
        source: 'wildfires',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'ACRES'],
                0, '#fee5d9',
                1000, '#fcbba1',
                5000, '#fc9272',
                10000, '#fb6a4a',
                25000, '#de2d26',
                50000, '#a50f15'
            ],
            'fill-opacity': 0.7
        }
    });

    map.on('click', 'wildfire-layer', (e) => {
        const fireName = e.features[0].properties.FIRENAME;
        const fireSize = e.features[0].properties.ACRES.toFixed(2); // 2 decimals rounded
        const fireYear = e.features[0].properties.YEAR;
        const fireCause = e.features[0].properties.CAUSE;
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${fireName}</strong><br>Size: ${fireSize} acres<br>Year: ${fireYear}<br>Cause: ${fireCause}`)
            .addTo(map);
    });

    function countWildfires(year) {
    // Get the features from the data source that match the year filter
    const features = map.querySourceFeatures('wildfires', {
        filter: ['==', ['get', 'YEAR'], year],
    });

    // Return the length of the features array
    return features.length;
    }

    // Add event listener for the slider
    const slider = document.getElementById('slider');
    const year = document.getElementById('year');
    const count = document.getElementById('count');
    slider.addEventListener('input', (e) => {
        // slider value
        const selectedYear = parseInt(e.target.value);
        // Update the map data based on the selected year
        // Implement your logic here to filter the data
        map.setFilter('wildfire-layer', ['==', 'YEAR', selectedYear]);
        year.textContent = selectedYear;
        // Update the count text
        count.textContent = 'Number of Wildfires: ' + countWildfires(selectedYear);
    });
});

// capture the element reset and add a click event to it.
const reset = document.getElementById('reset');
reset.addEventListener('click', event => {

// this event will trigger the map fly to its origin location and zoom level.
map.flyTo({
    zoom: 6.25,
    center: [-122.5565, 47.4114]
});

});