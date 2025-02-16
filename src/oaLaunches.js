import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaPlay } from "react-icons/fa"; 

function Launches() {
  const [launches, setLaunches] = useState([]);
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "upcoming", "launched"
  const [providerFilter, setProviderFilter] = useState("all"); // "all" or specific provider
  const [locationFilter, setLocationFilter] = useState("all"); // "all" or specific location
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    status: false,
    provider: false,
    location: false,
    sort: false, // Nieuw toegevoegd voor de sorteer dropdown
  });
  const [sortOrder, setSortOrder] = useState("upcoming-first"); // Standaard upcoming eerst


  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        // SpaceX API
        const spacexResponse = await fetch("https://api.spacexdata.com/v4/launches/upcoming");
        const spacexData = await spacexResponse.json();

        // RocketLaunch.Live API
        const rocketLaunchResponse = await fetch(
          "https://fdo.rocketlaunch.live/json/launches/next/5"
        );
        const rocketLaunchData = await rocketLaunchResponse.json();

        // Combine data
        const combinedLaunches = [
          // SpaceX Data
          ...spacexData.map((launch) => ({
            id: launch.id,
            name: launch.name || "Unnamed Mission",
            date: launch.date_utc ? new Date(launch.date_utc) : null,
            provider: "SpaceX",
            location: launch.launchpad || "Unknown location",
            link: launch.links?.webcast || "#",
            status: launch.date_utc && new Date(launch.date_utc) > new Date() ? "upcoming" : "launched",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/SpaceX-Logo.svg/1024px-SpaceX-Logo.svg.png", // Hardcoded SpaceX logo
          })),
          // RocketLaunch.Live Data
          ...rocketLaunchData.result.map((launch) => ({
            id: launch.id,
            name: launch.name || "Unnamed Mission",
            date: launch.win_open ? new Date(launch.win_open) : null,
            provider: launch.provider?.name || "Unknown provider",
            location: launch.pad?.location?.name || "Unknown location",
            link: launch.webcast_live || "#",
            status: launch.win_open && new Date(launch.win_open) > new Date() ? "upcoming" : "launched",
            logo: launch.provider?.logo_url || null, // Gebruik logo van RocketLaunch.Live API
          })),
        ];

        setLaunches(combinedLaunches);
        setFilteredLaunches(sortLaunches(combinedLaunches, "upcoming-first")); // Standaard sortering toepassen
      } catch (error) {
        console.error("Error fetching launch data:", error);
        setError("Failed to fetch launch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  // Functie om filters toe te passen
  const applyFilters = () => {
    let filtered = launches;
  
    if (statusFilter !== "all") {
      filtered = filtered.filter((launch) => launch.status === statusFilter);
    }
    if (providerFilter !== "all") {
      filtered = filtered.filter((launch) => launch.provider === providerFilter);
    }
    if (locationFilter !== "all") {
      filtered = filtered.filter((launch) => launch.location === locationFilter);
    }
  
    setFilteredLaunches(sortLaunches(filtered, sortOrder)); // Sorteer en update de lijst
  };
  


  const sortLaunches = (launchArray, order) => {
    return [...launchArray].sort((a, b) => {
      if (order === "upcoming-first") {
        if (a.status === "upcoming" && b.status !== "upcoming") return -1;
        if (b.status === "upcoming" && a.status !== "upcoming") return 1;
        return new Date(a.date) - new Date(b.date); // Binnen "upcoming" op datum sorteren
      }
      if (order === "date-asc") {
        return new Date(a.date) - new Date(b.date);
      }
      if (order === "date-desc") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  };
  
  

  // Effect voor filter updates
  useEffect(() => {
    applyFilters();
  }, [statusFilter, providerFilter, locationFilter, sortOrder, launches]);  

  if (loading) {
    return <p className="text-white text-center">Loading launches...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Unieke waarden voor filters
  const providers = ["all", ...new Set(launches.map((launch) => launch.provider))];
  const locations = ["all", ...new Set(launches.map((launch) => launch.location))];

  return (
    <div className="container-xl">
      <div className="title-container">
      <h1 className="text-center">Launches</h1>
      </div>

      {/* Filters */}
      <div className="filters mb-4">
        <div className="form-group">
          <label>Status:</label>
          <div className="dropdown-container">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              onClick={() =>
                setIsDropdownOpen((prev) => ({ ...prev, status: !prev.status }))
              }
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="launched">Launched</option>
            </select>
            <FaChevronDown
              className={`chevron ${isDropdownOpen.status ? "rotated" : ""}`}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Provider:</label>
          <div className="dropdown-container">
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="form-control"
              onClick={() =>
                setIsDropdownOpen((prev) => ({ ...prev, provider: !prev.provider }))
              }
            >
              {providers.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
            <FaChevronDown
              className={`chevron ${isDropdownOpen.provider ? "rotated" : ""}`}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location:</label>
          <div className="dropdown-container">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="form-control"
              onClick={() =>
                setIsDropdownOpen((prev) => ({ ...prev, location: !prev.location }))
              }
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <FaChevronDown
              className={`chevron ${isDropdownOpen.location ? "rotated" : ""}`}
            />
          </div>
        </div>

        <div className="form-group">
  <label>Sort by:</label>
  <div className="dropdown-container">
    <select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      className="form-control"
      onClick={() =>
        setIsDropdownOpen((prev) => ({ ...prev, sort: !prev.sort }))
      }
    >
      <option value="upcoming-first">Upcoming first</option>
      <option value="date-asc">Date (Oldest first)</option>
      <option value="date-desc">Date (Newest first)</option>
    </select>
    <FaChevronDown
      className={`chevron ${isDropdownOpen.sort ? "rotated" : ""}`}
    />
  </div>
</div>


      </div>

      {/* Launch List */}
      <ul className="launch-list">
  {filteredLaunches.map((launch, index) => (
    <li key={launch.id} className="launch-item">
      <div className="subtitle-wrapper">
      {/* Provider Pill */}
      {launch.provider && (
        <span
          className="provider-pill"
          style={{
            borderColor:
              index % 3 === 0
                ? "#8e6df3"
                : index % 3 === 1
                ? "#D63384"
                : "#FD7E14",
            color:
              index % 3 === 0
                ? "#8e6df3"
                : index % 3 === 1
                ? "#D63384"
                : "#FD7E14",
          }}
        >
          {launch.provider}
        </span>
      )}


        <a
          href={launch.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-round btn-play  btn btn-outline-light d-flex align-items-center"
          style={{ gap: "5px", width: "fit-content" }}
        >
          <FaPlay style={{ fontSize: "0.8rem" }} />
       
        </a>
    
      </div>
      <h2>{launch.name || "Unnamed Mission"}</h2>
      <div className="mission-meta">
      <p><span>Status:</span> {launch.status}</p>
      <p><span>Date:</span> {launch.date ? launch.date.toLocaleString() : "TBA"}</p>
      <p><span>Location:</span> {launch.location || "Unknown location"}</p>
      
      </div>
   
    </li>
  ))}
</ul>

    </div>
  );
}

export default Launches;


