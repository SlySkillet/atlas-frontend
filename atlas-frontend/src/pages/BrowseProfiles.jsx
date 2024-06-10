import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BrowseProfiles = () => {
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8000/api/profiles/',
                );
                if (response.ok) {
                    const profilesData = await response.json();
                    console.log(profilesData);
                    setProfiles(profilesData);
                } else {
                    return console.error();
                }
            } catch (error) {
                return console.error();
            }
        };
        fetchProfiles();
    }, []);
    console.log(profiles);
    return (
        <div>
            <h1>Profiles</h1>
            <table>
                <thead>
                    <tr>
                        <th>username</th>
                        <th>profile</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((p) => {
                        return (
                            <tr key={p.user.id}>
                                <td>{p.user.username}</td>
                                <td>
                                    <Link to={`/profile/${p.id}`}>profile</Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BrowseProfiles;
