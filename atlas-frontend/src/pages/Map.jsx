// import { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const BeaconMap = () => {
    const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
    return (
        <APIProvider
            apiKey={mapsApiKey}
            onLoad={() => console.log('Maps API has loaded')}
        >
            <Map
                defaultZoom={13}
                defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
                mapId={mapId}
            ></Map>
        </APIProvider>
    );
};

export default BeaconMap;
