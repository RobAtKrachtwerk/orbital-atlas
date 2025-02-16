import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AstronomyEventsCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/events"); // Call our backend
                if (!response.ok) throw new Error("Failed to fetch events");

                const data = await response.json();
                setEvents(data.data); // Adjust based on actual API response
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const onDateChange = (date) => {
        setSelectedDate(date);
    };

    const filteredEvents = events.filter(
        (event) => new Date(event.date).toDateString() === selectedDate.toDateString()
    );

    return (
        <div className="container mt-4">
            <h2>Astronomy Events Calendar</h2>
            <Calendar onChange={onDateChange} value={selectedDate} />
            <div className="mt-3">
                {loading && <p>Loading events...</p>}
                {error && <p>Error: {error}</p>}
                {filteredEvents.length > 0 ? (
                    <ul className="list-group">
                        {filteredEvents.map((event, index) => (
                            <li key={index} className="list-group-item">
                                <strong>{event.name}</strong> - {event.date}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events found for this date.</p>
                )}
            </div>
        </div>
    );
};

export default AstronomyEventsCalendar;
