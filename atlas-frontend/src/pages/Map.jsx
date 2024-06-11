import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import getCSRFToken from '../utils/auth';

const BeaconMap = () => {
    const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
    const center = { lat: 38.929526, lng: -76.989788 };

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
    }, [error]);

    useEffect(() => {
        const beaconLocations = [];
        for (let b of beacons) {
            const beaconObj = { key: b.id, location: b.location };
            beaconLocations.push(beaconObj);
        }
        setPoints(beaconLocations);
    }, [beacons]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <APIProvider
            apiKey={mapsApiKey}
            onLoad={() => console.log('Maps API has loaded')}
        >
            <Map
                defaultZoom={15}
                defaultCenter={center}
                mapId={mapId}
                onCameraChanged={(ev) =>
                    console.log(
                        'camera changed:',
                        ev.detail.center,
                        'zoom:',
                        ev.detail.zoom,
                    )
                }
            >
                {points.map((pnt) => {
                    return (
                        <AdvancedMarker
                            key={pnt.key}
                            position={pnt.location}
                        ></AdvancedMarker>
                    );
                })}
            </Map>
        </APIProvider>
    );
};

export default BeaconMap;
