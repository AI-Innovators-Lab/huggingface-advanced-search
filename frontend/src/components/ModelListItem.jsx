import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
// Enhanced styling for a "card" look
const itemStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Slightly transparent white background for the card
    backdropFilter: 'blur(5px)', // Optional: adds a blur effect to content behind the card (browser support varies)
    border: '1px solid rgba(200, 200, 200, 0.5)', // Softer border
    padding: '20px', // Increased padding
    marginBottom: '15px',
    borderRadius: '8px', // More rounded corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Softer, more modern shadow
    transition: 'transform 0.2s ease-in-out, boxShadow 0.2s ease-in-out', // Smooth hover effect
    // Adding a hover effect:
    // '&:hover': { // This pseudo-selector syntax works with CSS-in-JS libs like Emotion/Styled-Components
    //   transform: 'translateY(-3px)',
    //   boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    // },
};

const titleStyle = {
    fontSize: '1.3em', // Slightly larger
    fontWeight: '600', // Semi-bold
    marginBottom: '8px',
    color: '#2c3e50', // Darker, more professional color
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const detailStyle = {
    fontSize: '0.95em',
    color: '#555', // Slightly darker grey for better readability
    marginBottom: '4px',
    lineHeight: '1.5',
};

const tagContainerStyle = {
    marginTop: '12px',
    display: 'flex',
    flexWrap: 'wrap', // Allow tags to wrap
    gap: '6px', // Spacing between tags
};

const tagStyle = {
    backgroundColor: '#e9ecef', // Lighter grey for tags
    color: '#495057', // Darker text for tags
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '0.85em',
};

const ggufIndicatorStyle = {
    backgroundColor: '#d1e7dd', // Light green (Bootstrap success light)
    color: '#0f5132',          // Dark green (Bootstrap success dark)
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.85em',
    fontWeight: 'bold',
    // marginLeft: '10px', // Removed, handled by flexbox in titleStyle
};

// Style for the checkbox container
const checkboxContainerStyle = {
    marginRight: '15px', // Space between checkbox and title
    display: 'flex',
    alignItems: 'center',
};

const checkboxStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
};


function ModelListItem({ model, isSelected, onToggleCompare }) { // Added isSelected and onToggleCompare
    if (!model) return null;

    const detailUrl = `/model/${model.id}`;

    const currentItemStyle = {
        ...itemStyle,
        border: isSelected ? '2px solid #007bff' : itemStyle.border, // Highlight if selected
        backgroundColor: isSelected ? 'rgba(220, 235, 255, 0.85)' : itemStyle.backgroundColor,
    };

    const handleItemClick = (e) => {
        // Prevent navigation if the click was on the checkbox or its direct parent label (if any)
        // For a simple checkbox, checking the target itself is often enough.
        if (e.target.type === 'checkbox') {
            return;
        }
        // If the click was not on the checkbox, allow the Link to navigate.
        // This logic might need adjustment if the checkbox is wrapped in other elements.
    };

    return (
        // The Link wrapping the whole item can be tricky with interactive elements inside.
        // Consider making only part of the item (like the title) a Link,
        // or handling navigation programmatically if needed.
        // For now, let's keep the Link and try to manage click propagation.

        <div 
            style={currentItemStyle}
            onMouseOver={(e) => { 
                if (!isSelected) { // Only apply hover style if not selected (or apply a different one)
                    e.currentTarget.style.borderColor = '#007bff'; 
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
                }
            }}
            onMouseOut={(e) => { 
                if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(200, 200, 200, 0.5)'; 
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }
            }}
            // onClick={handleItemClick} // Add this if you want to control navigation more finely
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={checkboxContainerStyle}>
                    <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={(e) => {
                            // e.stopPropagation(); // Stop event from bubbling to parent Link if it causes issues
                            onToggleCompare(model.id);
                        }}
                        style={checkboxStyle}
                        title={isSelected ? "Deselect for comparison" : "Select for comparison"}
                    />
                </div>
                <Link to={detailUrl} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                    <div style={titleStyle}>
                        <span>{model.id}</span>
                        {model.has_gguf && <span style={ggufIndicatorStyle}>GGUF</span>}
                    </div>
                </Link>
            </div>
            {/* The rest of the model details */}
            {model.author && <div style={detailStyle}>Author: {model.author}</div>}
            <div style={detailStyle}>Downloads: {model.downloads?.toLocaleString()}</div>
            <div style={detailStyle}>Likes: {model.likes?.toLocaleString()}</div>
            <div style={detailStyle}>Last Modified: {new Date(model.last_modified).toLocaleDateString()}</div>
            {model.pipeline_tag && <div style={detailStyle}>Task: {model.pipeline_tag}</div>}
            
            {model.tags && model.tags.length > 0 && (
                <div style={tagContainerStyle}>
                    {model.tags.slice(0, 7).map((tag, index) => (
                        <span key={index} style={tagStyle}>{tag}</span>
                    ))}
                </div>
            )}
        </div>
        // </Link> // Original Link placement - might be better to move it or handle clicks carefully
    );
}

export default ModelListItem;