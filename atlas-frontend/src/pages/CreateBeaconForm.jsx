import { useState } from 'react';

const CreateBeaconForm = () => {
    const [beaconFormData, setBeaconFormData] = useState({
        description: '',
        start_time: new Date(),
        end_time: new Date(),
        capacity: 1,
        location: { lat: null, lon: null },
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
                <div>location</div>
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
                <button>create beacon</button>
            </form>
        </div>
    );
};

export default CreateBeaconForm;
