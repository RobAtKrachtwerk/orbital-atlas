import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AstronomyEventsCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = "https://orbital-atlas.onrender.com"; // Backend URL
// Verwijderde API-aanroep, geen fetch meer
useEffect(() => {
    setEvents([]); // Zet een lege lijst of statische data als je wilt
    setLoading(false);
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
