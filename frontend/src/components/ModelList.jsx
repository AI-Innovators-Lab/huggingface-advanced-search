import React from 'react';
import ModelListItem from './ModelListItem';

const listContainerStyle = {
    marginTop: '20px',
};

const noResultsStyle = {
    textAlign: 'center',
    color: '#777',
    padding: '20px',
};

function ModelList({ models, isLoading, error, selectedForComparison, onToggleCompare }) { // Added props
    if (isLoading) {
        return <div style={noResultsStyle}>Loading models...</div>;
    }

    if (error) {
        return <div style={{ ...noResultsStyle, color: 'red' }}>Error loading models: {error}</div>;
    }

    if (!models || models.length === 0) {
        return <div style={noResultsStyle}>No models found. Try a different search.</div>;
    }

    return (
        <div style={listContainerStyle}>
            {models.map((model) => (
                <ModelListItem 
                    key={model.id} 
                    model={model} 
                    isSelected={selectedForComparison.includes(model.id)} // Pass isSelected
                    onToggleCompare={onToggleCompare}                     // Pass handler
                />
            ))}
        </div>
    );
}

export default ModelList;