import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AstronomyEventsCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = "https://orbital-atlas.onrender.com"; // Backend URL

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/astronomy-events`);
                if (!response.ok) throw new Error("Failed to fetch events");
    
                const data = await response.json();
                console.log("Astronomy API Events via Proxy:", data);
    
                if (!data.data) throw new Error("Invalid API response");
    
                const formattedEvents = data.data.map(event => ({
                    id: event.id,
                    name: event.name,
                    date: event.date
                }));
    
                setEvents(formattedEvents);
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
        (event) => new Date(event.date).toISOString().split("T")[0] === selectedDate.toISOString().split("T")[0]
    );

    return (
        <div className="container mt-4">
            <h2>Astronomy Events Calendar</h2>
            <Calendar onChange={onDateChange} value={selectedDate} />
            <div className="mt-3">
                {loading && <p>Loading events...</p>}
                {error && <p className="text-danger">Error: {error}</p>}
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
