import { useState, useEffect } from 'react';
import getCSRFToken from '../utils/auth';

const BeaconFeed = () => {
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
                }
            } catch (error) {
                console.error('Error: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBeacons();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Owner</th>
                        <th>Ends</th>
                        <th>Location.y</th>
                        <th>Location.x</th>
                        <th>Description</th>
                        <th>Capacity</th>
                        <th>Visibility</th>
                    </tr>
                </thead>
                <tbody>
                    {beacons.map((b) => {
                        return (
                            <tr key={b.id}>
                                <td>{b.owner.user.username}</td>
                                <td>{b.end_datetime}</td>
                                <td>{b.location.lat}</td>
                                <td>{b.location.lng}</td>
                                <td>{b.description}</td>
                                <td>{b.capacity}</td>
                                <td>{b.visibility}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BeaconFeed;
