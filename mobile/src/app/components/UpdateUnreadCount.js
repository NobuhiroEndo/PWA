import React, { useState } from 'react';

const UpdateUnreadCount = () => {
    const [userId, setUserId] = useState('');
    const [increment, setIncrement] = useState(0);
    const [decrement, setDecrement] = useState(0);

    const baseURL = process.env.REACT_APP_API_BASE_URL;

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${baseURL}/update_unread_count/${userId}/update_unread_count/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    increment,
                    decrement,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            alert(`Unread count updated successfully.`);
        } catch (error) {
            console.error('Error updating unread count:', error);
            alert('Failed to update unread count.');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
            />
            <input
                type="number"
                value={increment}
                onChange={(e) => setIncrement(e.target.value)}
                placeholder="Increment"
            />
            <input
                type="number"
                value={decrement}
                onChange={(e) => setDecrement(e.target.value)}
                placeholder="Decrement"
            />
            <button onClick={handleUpdate}>Update Unread Count</button>
        </div>
    );
};

export default UpdateUnreadCount;