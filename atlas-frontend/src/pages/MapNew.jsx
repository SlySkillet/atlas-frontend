import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import getCSRFToken from '../utils/auth';
import { FaChevronDown } from 'react-icons/fa';

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

    // ============================ PLACE BEACONS =============================
    // retrieve Beacons
    const [beacons, setBeacons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, [error]);

    // Add marker to map for each beacon
    // NOTE: test --> if user has no visible beacons then...

    // state for beacon popup
    const [beaconPopUp, setBeaconPopUp] = useState({
        isOpen: false,
        data: null,
    });

    useEffect(() => {
        if (!map.current || !beacons) return;

        if (!loading) {
            beacons.forEach((beacon) => {
                const marker = new mapboxgl.Marker()
                    .setLngLat([beacon.location.lng, beacon.location.lat])
                    .addTo(map.current);

                console.log(marker);
                // Add click event listener to marker
                marker.getElement().addEventListener('click', () => {
                    console.log('bcnDescription --> ', beacon);
                    setBeaconPopUp({ isOpen: true, data: beacon });
                    map.current.flyTo({
                        center: [beacon.location.lng, beacon.location.lat],
                        offset: [0, -200],
                        essential: true,
                        zoom: 15,
                    });
                });
            });
        }
    }, [beacons, loading]);

    // ============================= RENDER PAGE ==============================
    return (
        <div className="row-start-2 row-end-3 grid h-full flex-col">
            {mapReady ? (
                <div
                    ref={mapContainer}
                    className="map-container h-full w-full"
                />
            ) : (
                <div>Loading map...</div>
            )}
            {beaconPopUp.isOpen && (
                <div className="absolute z-50 h-[60%] w-full self-end justify-self-center rounded-t-lg bg-mine-shaft-900 text-white">
                    <button
                        className="rounded-b-lg bg-mine-shaft-950 pb-1 pl-14 pr-14 pt-1 text-xl text-mine-shaft-300"
                        onClick={() => {
                            map.current.flyTo({
                                center: [
                                    beaconPopUp.data.location.lng,
                                    beaconPopUp.data.location.lat,
                                ],
                                zoom: 14,
                                essential: true,
                            }),
                                setBeaconPopUp({ isOpen: false, data: null });
                        }}
                    >
                        <FaChevronDown />
                    </button>
                    <p>{beaconPopUp.data.description}</p>
                </div>
            )}
        </div>
    );
};

export default NewMap;
