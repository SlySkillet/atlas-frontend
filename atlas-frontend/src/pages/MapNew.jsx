import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

const NewMap = () => {
    // MapBox initialize
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    console.log(mapboxgl.accessToken);
    const mapContainer = useRef(null);
    const map = useRef(null);

    const [mapReady, setMapReady] = useState(false);
    const [lng, setLng] = useState(-77.124813);
    const [lat, setLat] = useState(38.92366);
    const zoom = 12;

    // retrieve user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLng(longitude);
                    setLat(latitude);
                    setMapReady(true);
                },
                (error) => {
                    console.error('Error obtaining location', error);
                    setMapReady(true);
                },
            );
        }
    }, []);

    // initialize map
    useEffect(() => {
        if (map.current || !mapReady) return;

        if (lat && lng) {
            // create new instance of mapbox map, save to map Ref
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom,
            });
        }
    }, [lng, lat, zoom, mapReady]);

    // retrieve Beacons

    // ============================= RENDER PAGE ==============================
    return (
        // BUG: not rendering snuggly between rows 2 and 3
        <div className="">
            {mapReady ? (
                <div
                    ref={mapContainer}
                    className="map-container"
                    style={{ width: '100%', height: '100vh' }}
                />
            ) : (
                <div>Loading map...</div>
            )}
        </div>
    );
};

export default NewMap;
