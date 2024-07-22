import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const CreateBeaconForm = () => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    //   initialize state values,
    const [lng, setLng] = useState(-77.124813);
    const [lat, setLat] = useState(38.92366);
    const [zoom, setZoom] = useState(12);
    const [mapReady, setMapReady] = useState(false);

    // get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
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
            // create new instance of mapbox map
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom,
            });

            map.current.on('move', () => {
                // uses map camera properties
                const center = map.current.getCenter();
                const zoom = map.current.getZoom();

                // updates state
                setLng(center.lng);
                setLat(center.lat);
                setZoom(zoom);
            });

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
                    location: { longitude: clickLng, latitude: clickLat },
                }));
            });
        }
    }, [lng, lat, zoom, mapReady]);

    const [beaconFormData, setBeaconFormData] = useState({
        description: '',
        start_time: new Date(),
        end_time: new Date(),
        capacity: 1,
        location: { lng: null, lat: null },
        visibility: 'FRIENDS',
        visibility_polygon: null,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBeaconFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(beaconFormData);
    };

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
                    <label htmlFor="start_time">start time</label>
                    <input
                        type="datetime-local"
                        id="start_time"
                        name="start_time"
                        value={beaconFormData.start_time}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="end_time">end time</label>
                    <input
                        type="datetime-local"
                        id="end_time"
                        name="end_time"
                        value={beaconFormData.end_time}
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
                        <option value="FRIENDS">visible to friends only</option>
                        <option value="ALL">visible to all users</option>
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
                    {beaconFormData.location.longitude},{' '}
                    {beaconFormData.location.latitude}
                </div>
                <button>create beacon</button>
            </form>
        </div>
    );
};

export default CreateBeaconForm;
