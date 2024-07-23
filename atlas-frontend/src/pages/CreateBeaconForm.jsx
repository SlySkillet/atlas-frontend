import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import getCSRFToken from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const CreateBeaconForm = () => {
    //  mapbox initiation
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    const navigate = useNavigate();

    //  initialize state values
    const [lng, setLng] = useState(-77.124813);
    const [lat, setLat] = useState(38.92366);
    const zoom = 12; // hard coded value for map rendering... confirm and update this value
    const [mapReady, setMapReady] = useState(false);
    const [beaconFormData, setBeaconFormData] = useState({
        description: '',
        start_datetime: new Date(),
        end_datetime: new Date(),
        capacity: 1,
        location: { lng: null, lat: null },
        visibility: 'friends',
        visibility_polygon: null,
    });

    // ========================= LOCATION SELECTION ===========================

    // get user location
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

            // click handler for beacon location selection
            map.current.on('click', (e) => {
                const clickLng = e.lngLat.lng;
                const clickLat = e.lngLat.lat;
                console.log(e.lngLat);
                if (marker.current) {
                    marker.current.remove();
                }
                marker.current = new mapboxgl.Marker({
                    color: '#44c55c',
                })
                    .setLngLat([clickLng, clickLat])
                    .addTo(map.current);
                setBeaconFormData((prevData) => ({
                    ...prevData,
                    location: { lng: clickLng, lat: clickLat },
                }));
            });
        }
    }, [lng, lat, zoom, mapReady]);

    // ========================== FORM HANDLING ===============================

    // handle change in inputs, update beaconFormData
    const handleChange = (event) => {
        const { name, value } = event.target;
        setBeaconFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // format datestring to pass to django
    const formatDate = (datestring) => {
        const date = new Date(datestring);
        return date.toISOString();
    };

    // submit form, 'POST' to users-beacons endpoint
    const handleSubmit = async (event) => {
        event.preventDefault();
        const csrfToken = getCSRFToken();

        // format data for endpoint
        const formattedData = {
            ...beaconFormData,
            start_datetime: formatDate(beaconFormData.start_datetime),
            end_datetime: formatDate(beaconFormData.end_datetime),
            capacity: parseInt(beaconFormData.capacity),
        };

        // make 'POST' request
        const fetchUrl = 'http://localhost:8000/api/beacons/mybeacons/';
        const fetchConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(formattedData),
            credentials: 'include',
        };
        try {
            const response = await fetch(fetchUrl, fetchConfig);
            if (response.ok) {
                // NOTE: add alert behavior for success and failure
                //  * incomplete field notification
                //  * server error notification
                navigate('/myprofile');
            }
        } catch (error) {
            console.error('create beacon failed', error);
        }
    };

    // ============================= RENDER PAGE ==============================

    return (
        <div>
            <h1>Create a Beacon</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="description">description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        cols="50"
                        value={beaconFormData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="start_datetime">start time</label>
                    <input
                        type="datetime-local"
                        id="start_datetime"
                        name="start_datetime"
                        value={beaconFormData.start_datetime}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="end_datetime">end time</label>
                    <input
                        type="datetime-local"
                        id="end_datetime"
                        name="end_datetime"
                        value={beaconFormData.end_datetime}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="capacity">capacity</label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        min="1"
                        value={beaconFormData.capacity}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="visibility">visibility</label>
                    <select
                        id="visibility"
                        name="visibility"
                        value={beaconFormData.visibility}
                        onChange={handleChange}
                    >
                        <option value="friends">visible to friends only</option>
                        <option value="all">visible to all users</option>
                    </select>
                </div>
                <div>
                    {mapReady ? (
                        <div
                            ref={mapContainer}
                            className="map-container"
                            style={{ width: '100%', height: '400px' }}
                        />
                    ) : (
                        <div>Loading map...</div>
                    )}
                </div>
                <div>
                    {beaconFormData.location.lng}, {beaconFormData.location.lat}
                </div>
                <button>create beacon</button>
            </form>
        </div>
    );
};

export default CreateBeaconForm;
