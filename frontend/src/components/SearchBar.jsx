import React, { useState } from 'react';

// Basic styling (can be moved to a CSS file)
const searchBarStyle = {
    display: 'flex',
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
};

const inputStyle = {
    flexGrow: 1,
    padding: '8px',
    marginRight: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
};

const buttonStyle = {
    padding: '8px 15px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
};

function SearchBar({ onSearch, isLoading }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch({ query: query.trim() });
        } else {
            // Optionally, search for all models if query is empty,
            // or show a message. For now, let's require a query.
            onSearch({}); // Trigger search for all if query is empty
            // alert("Please enter a search term.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={searchBarStyle}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for models (e.g., 'bert', 'image generation')..."
                style={inputStyle}
                disabled={isLoading}
            />
            <button type="submit" style={buttonStyle} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
            </button>
        </form>
    );
}

export default SearchBar;