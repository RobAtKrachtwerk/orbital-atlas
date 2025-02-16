import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './App.css';
import clearSkyIcon from "./media/weather-icons/weather-icon-clearsky.svg";
import fewCloudsIcon from "./media/weather-icons/weather-icon-fewclouds.svg";
import partlyCloudyIcon from "./media/weather-icons/weather-icon-partycloudy.svg";
import mostlyCloudyIcon from "./media/weather-icons/weather-icon-mostlycloudy.svg";
import overcastIcon from "./media/weather-icons/weather-icon-overcast.svg";
import unknownIcon from "./media/weather-icons/weather-icon-unkown.svg";
import launchesIcon from "./media/icons/launches-icon.svg";

const WelcomeMessage = () => {
    const { user, isAuthenticated } = useAuth0();

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return "Good Morning";
        } else if (currentHour < 18) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };

    return (
        <div className="title-container my-5">
            <h2 className="text-center style-element-1">
                {getGreeting()}
                {isAuthenticated && user?.given_name ? <>, <br /> {user.given_name}</> : ""}
            </h2>
        </div>
    );
};



const weatherConditions = [
    { maxClouds: 10, condition: "Clear Skies", icon: clearSkyIcon },
    { maxClouds: 30, condition: "Few Clouds", icon: fewCloudsIcon },
    { maxClouds: 60, condition: "Partly Cloudy", icon: partlyCloudyIcon },
    { maxClouds: 80, condition: "Mostly Cloudy", icon: mostlyCloudyIcon },
    { maxClouds: 100, condition: "Overcast", icon: overcastIcon },
];

const getWeatherCondition = (clouds) => {
    for (let condition of weatherConditions) {
        if (clouds <= condition.maxClouds) {
            return condition;
        }
    }
    return { condition: "Unknown", icon: unknownIcon }; // Fallback als clouds.all ontbreekt
};

const Discover = () => {
    const [location, setLocation] = useState("Unknown Location");
    const [clearSkyPercentage, setClearSkyPercentage] = useState(null);
    const [skyCondition, setSkyCondition] = useState("Unknown");
    const [weatherIcon, setWeatherIcon] = useState(unknownIcon); // Default icoon

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const apiKey = "afa783f567a847bff89c005c1ee41c7c";
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=en`;

                try {
                    const response = await fetch(weatherUrl);
                    const data = await response.json();
                    console.log("Weather API Response:", data);

                    if (!data || !data.clouds) {
                        throw new Error("Weather data is missing");
                    }

                    const clouds = data.clouds?.all ?? 100;
                    console.log("Cloud coverage:", clouds);
                    const clearSky = Math.max(0, 100 - clouds);
                    console.log("Clear Sky Percentage:", clearSky);

                    const { condition, icon } = getWeatherCondition(clouds);
                    setLocation(data.name || "Unknown Location");
                    setClearSkyPercentage(clearSky);
                    setSkyCondition(condition);
                    setWeatherIcon(icon);
                } catch (error) {
                    console.error("Error fetching weather data:", error);
                    setLocation("Unknown Location");
                    setClearSkyPercentage(0);
                    setSkyCondition("Unknown");
                    setWeatherIcon(unknownIcon);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocation("Unknown Location");
                setClearSkyPercentage(0);
                setSkyCondition("Unknown");
                setWeatherIcon(unknownIcon);
            }
        );
    }, []);

    const [nextLaunch, setNextLaunch] = useState(null);

    useEffect(() => {
        const fetchLaunches = async () => {
            try {
                const spacexResponse = await fetch("https://api.spacexdata.com/v4/launches/upcoming");
                const spacexData = await spacexResponse.json();
                const rocketLaunchResponse = await fetch("https://fdo.rocketlaunch.live/json/launches/next/5");
                const rocketLaunchData = await rocketLaunchResponse.json();
    
                const combinedLaunches = [
                    ...spacexData.map((launch) => ({
                        id: launch.id,
                        name: launch.name || "Unnamed Mission",
                        date: launch.date_utc ? new Date(launch.date_utc) : null,
                        provider: "SpaceX",
                        location: launch.launchpad || "Unknown location",
                        link: launch.links?.webcast || "#",
                        status: "upcoming", // SpaceX data zijn altijd upcoming
                    })),
                    ...rocketLaunchData.result.map((launch) => ({
                        id: launch.id,
                        name: launch.name || "Unnamed Mission",
                        date: launch.win_open ? new Date(launch.win_open) : null,
                        provider: launch.provider?.name || "Unknown provider",
                        location: launch.pad?.location?.name || "Unknown location",
                        link: launch.webcast_live || "#",
                        status: launch.win_open && new Date(launch.win_open) > new Date() ? "upcoming" : "launched",
                    })),
                ];
    
                // 🔹 Log de ruwe data voor debugging
                console.log("Fetched Launches:", combinedLaunches);
    
                // 🔹 Filter alleen launches met een geldige datum en status "upcoming"
                const upcomingLaunches = combinedLaunches
                    .filter((launch) => launch.date && launch.status === "upcoming" && launch.date > new Date());
    
                // 🔹 Log gefilterde upcoming launches
                console.log("Upcoming Launches (filtered):", upcomingLaunches);
    
                // 🔹 Sorteer op datum (oudste eerst)
                const sortedUpcomingLaunches = upcomingLaunches.sort((a, b) => a.date - b.date);
    
                // 🔹 Log gesorteerde upcoming launches
                console.log("Upcoming Launches (sorted):", sortedUpcomingLaunches);
    
                // 🔹 Pak de eerstvolgende upcoming launch
                setNextLaunch(sortedUpcomingLaunches.length > 0 ? sortedUpcomingLaunches[0] : null);
            } catch (error) {
                console.error("Error fetching launch data:", error);
            }
        };
    
        fetchLaunches();
    }, []);
    


    useEffect(() => {
        console.log("Updated clearSkyPercentage:", clearSkyPercentage);
    }, [clearSkyPercentage]);

    return (
        <div className="discover-container container-xl">
            <WelcomeMessage />
            <div className="row mt-4">

                {/* STARGAZING */}
                <div className="col-md-4">
                <div className="w-100 text-start"><h5>Stargazing Conditions</h5></div>
                    <div className="info-block p-4 text-center flex-wrap rounded d-flex justify-content-between flex-row ">
                        
                        <div className="pe-3">
                            <img
                                src={weatherIcon}
                                alt={skyCondition}
                            
                            />
                        </div>
                        <div className="text-start">
                            <h5 className="fw-bold">Today</h5>
                            {clearSkyPercentage !== null ? (
                                <>
                                    <h2 className="sky-percentage">{clearSkyPercentage}%</h2>
                                    <p className="color-primary m-0">{skyCondition}, {location}</p>
                                </>
                            ) : (
                                <p>Loading weather data...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* UPCOMING LAUNCHES */}
                <div className="col-md-4 ">
                <div className="w-100 text-start"><h5>Upcoming Launches</h5></div>
                <div className="info-block p-4 text-center flex-wrap rounded d-flex justify-content-center flex-row ">

                <div className="pe-3">
                            <img
                                src={launchesIcon}
                                alt="launches icon"
                              
                            />
                        </div>

                        <div className="text-start ">
                    {nextLaunch ? (
        <>
            <h5 className="fw-bold">{nextLaunch.name}</h5>
            <p className="small mb-1 color-primary"><strong>Provider:</strong> {nextLaunch.provider}</p>
            <p className="small mb-1 color-primary"><strong>Date:</strong> {nextLaunch.date.toLocaleString()}</p>
            <p className="small mb-1 color-primary"><strong>Location:</strong> {nextLaunch.location}</p>
         
        </>
    ) : (
        <p>Loading upcoming launch...</p>
    )}</div>
                    </div>
                </div>
                <div className="col-md-4">
                <div className="w-100 text-start"><h5>Favorites</h5></div>
                    <div className="info-block p-4 text-center shadow rounded">
                        <h3>Your Favorites</h3>
                        <p>Track and save missions!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;