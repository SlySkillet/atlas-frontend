import { useState, useRef, useEffect } from 'react';
// import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import mapboxgl from 'mapbox-gl';

const CreateBeaconForm = () => {
    // const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
    // const center = { lat: 38.929526, lng: -76.989788 };
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const mapContainer = useRef(null);
    const map = useRef(null);

    //   initialize state values,
    const [lng, setLng] = useState(-76.994558);
    const [lat, setLat] = useState(38.936673);
    const [zoom, setZoom] = useState(12);

    // get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setLng(longitude);
                    setLat(latitude);
                    // console.log({ latitude, longitude });
                },
                (error) => {
                    console.error('Error obtaining location', error);
                },
            );
        }
    }, []);

    // initialize map
    useEffect(() => {
        if (map.current) return;

        // create new instance of mapbox map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
        });
    });

    // map.current.on('move', () => {
    //     // uses map camera properties
    //     const center = map.current.getCenter();
    //     const zoom = map.current.getZoom();

    //     // updates state
    //     setLng(center.lng);
    //     setLat(center.lat);
    //     setZoom(zoom);
    // });

    const [beaconFormData, setBeaconFormData] = useState({
        description: '',
        start_time: new Date(),
        end_time: new Date(),
        capacity: 1,
        location: { lat: null, lng: null },
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

    // ======================LOCATION SELECTION=======================

    const [position, setPosition] = useState({});

    // const handleMapClick = (event) => {
    //     if (event.latLng) {
    //         const lat = event.latLng.lat();
    //         const lng = event.latLng.lng();
    //         setPosition({ lat, lng });
    //         console.log(position);
    //     } else {
    //         console.error('event.latLng is undefined');
    //     }
    // };

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
                <div ref={mapContainer} className="map-container" />
                {/* <div style={{ height: '500px', width: '60%' }}>
                    <APIProvider
                        apiKey={mapsApiKey}
                        onLoad={() => console.log('Maps API has loaded')}
                    >
                        <Map
                            defaultZoom={13}
                            defaultCenter={center}
                            mapId={mapId}
                            onClick={handleMapClick}
                        >
                            {position && <Marker position={position} />}
                        </Map>
                    </APIProvider>
                </div> */}
                <button>create beacon</button>
            </form>
        </div>
    );
};

export default CreateBeaconForm;
