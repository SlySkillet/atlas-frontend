import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import getCSRFToken from '../utils/auth';

const NewMap = () => {
    // MapBox initialize
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
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
    const [beacons, setBeacons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const fetchBeacons = async () => {
            try {
                const csrfToken = getCSRFToken();
                const fetchBeaconsUrl = 'http://localhost:8000/api/beacons/';
                const fetchConfig = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                };
                const response = await fetch(fetchBeaconsUrl, fetchConfig);
                if (response.ok) {
                    const beaconData = await response.json();
                    setBeacons(beaconData);
                } else {
                    setError('Failed to fetch beacons');
                    console.error(error);
                }
            } catch (error) {
                console.error('Error: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBeacons();
    }, [beacons, error]);

    useEffect(() => {
        const beaconLocations = [];
        for (let b of beacons) {
            const beaconObj = { key: b.id, location: b.location };
            beaconLocations.push(beaconObj);
        }
        setPoints(beaconLocations);
    }, [beacons]);

    // ISSUE: points are rendered with only location data
    // These need to be tied in with all beacon data
    useEffect(() => {
        if (!map.current || points.length === 0) return;

        if (!loading) {
            points.forEach((point) => {
                new mapboxgl.Marker()
                    .setLngLat([point.location.lng, point.location.lat])
                    .addTo(map.current);
            });
        }
    }, [points, loading]);

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
