import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import placeholderImage from "./media/preview-unkown.png";

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [visibleArticles, setVisibleArticles] = useState(12);
    const [isDropdownOpen, setIsDropdownOpen] = useState({});

    const truncateText = (text, limit) => {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };
    const loadMoreArticles = () => {
        setVisibleArticles(prevCount => prevCount + 12);
    };
    const excludedSources = ["Kotaku", "Hackaday", "Android Central", "The Verge", "CNET"];

    

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const sources = [
                    "https://api.spaceflightnewsapi.net/v4/articles",
                    "https://api.nasa.gov/planetary/apod?api_key=YTKTUKgbGVKhAMjY0RuB8XNnzKfrBIRTQPt5aVDK",
                    "https://newsapi.org/v2/everything?q=space&apiKey=4ca66cf042d7488b84dfef28759f99dc"
                ];
                
                const responses = await Promise.all(sources.map(async (url) => {
                    try {
                        const res = await fetch(url);
                        if (!res.ok) throw new Error(`Error fetching ${url}`);
                        return await res.json();
                    } catch (error) {
                        console.error(`Error fetching ${url}:`, error);
                        return null;
                    }
                }));
                
                const formattedArticles = responses.flatMap((data, index) => {
                    if (!data || typeof data !== "object") return [];
                    if (index === 0 && Array.isArray(data.results)) {
                        return data.results.map(article => ({
                            id: article.id,
                            title: article.title,
                            summary: article.summary || "No summary available.",
                            image_url: article.image_url,
                            url: article.url,
                            newsSite: article.newsSite || "SpaceFlight News"
                        }));
                    } else if (index === 1 && data.title) {
                        return [{
                            id: data.date || Date.now(),
                            title: data.title,
                            summary: data.explanation || "No summary available.",
                            image_url: data.url,
                            url: data.hdurl || data.url,
                            newsSite: "NASA"
                        }];
                    } else if (index === 2 && Array.isArray(data.articles)) {
                        return data.articles.map(article => ({
                            id: article.url,
                            title: article.title,
                            summary: article.description || "No summary available.",
                            image_url: article.urlToImage,
                            url: article.url,
                            newsSite: article.source?.name || "Unknown Source"
                        }));
                    }
                    return [];
                });
                
                setArticles(formattedArticles);
            } catch (error) {
                console.error("Fetching error:", error);
                setError("Failed to fetch news.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchNews();
    }, []);
    
    const filteredArticles = articles.filter(article =>
        !excludedSources.includes(article.newsSite) &&
        (category === "all" || article.newsSite === category) &&
        (searchQuery === "" || article.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    

    const currentArticles = filteredArticles.slice(0, visibleArticles);

    const categories = [
        "all",
        ...new Set(
            articles
                .filter(article => !excludedSources.includes(article.newsSite))
                .map(article => article.newsSite)
                .filter(Boolean)
        )
    ];
    

    if (loading) {
        return <p className="text-white text-center">Loading news...</p>;
    }

    if (error) {
        return <p className="text-white text-center">{error}</p>;
    }

    return (
        <div className="container-xl">
            <div className="title-container">
                <h1 className="text-center">Space News</h1>
            </div>

            {/* Filters */}
            <div className="filters mb-4 d-flex flex-wrap gap-3 align-items-center">
                <div className="form-group">
                    <label>Search:</label>
                    <input
                        type="text"
                        placeholder="Search news..."
                        className="form-control"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <div className="dropdown-container">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-control"
                            onClick={() => setIsDropdownOpen(prev => ({ ...prev, category: !prev.category }))}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <FaChevronDown className={`chevron ${isDropdownOpen.category ? "rotated" : ""}`} />
                    </div>
                </div>
            </div>

         
            {/* News Cards */}
            <div className="row">
    {currentArticles.map((article, index) => (
        <div className="col-md-4 mb-4" key={article.id}>
            <div className="card shadow-sm" style={{ minHeight: "100%" }}>
                <img 
                    src={article.image_url || placeholderImage} 
                    className="card-img-top" 
                    alt={article.title} 
                    style={{ maxHeight: "220px", objectFit: "cover" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                />
                <div className="card-body d-flex flex-column">
                    {article.newsSite && (
                        <span className="provider-pill" style={{ borderColor: index % 3 === 0 ? "#8e6df3" : index % 3 === 1 ? "#D63384" : "#FD7E14", color: index % 3 === 0 ? "#8e6df3" : index % 3 === 1 ? "#D63384" : "#FD7E14" }}>
                            {article.newsSite}
                        </span>
                    )}
                    <h5 className="card-title mt-2">{article.title}</h5>
                    <p className="card-text">{truncateText(article.summary, 128)}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-auto">Read More</a>
                </div>
            </div>
        </div>
    ))}
</div>


{visibleArticles < filteredArticles.length && (
    <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={loadMoreArticles}>Load More</button>
    </div>
)}

        </div>
    );
};

export default News;