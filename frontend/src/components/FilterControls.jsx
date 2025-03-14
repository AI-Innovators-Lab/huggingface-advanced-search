// frontend/src/components/FilterControls.jsx
import React from 'react';

const filterContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px', // Consistent gap
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.75)', // Slightly more opaque
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const filterGroupStyle = { // Renamed for clarity
    display: 'flex',
    gap: '15px', // Gap between multiple filter dropdowns
    flexWrap: 'wrap', // Allow filter dropdowns to wrap
    alignItems: 'center',
};

const controlGroupStyle = { // For individual label + select
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

const labelStyle = {
    fontWeight: 'bold',
    fontSize: '0.9em', // Slightly smaller label
    color: '#333',
};

const selectStyle = {
    padding: '8px 10px',
    border: '1px solid #ced4da', // Softer border
    borderRadius: '4px',
    minWidth: '180px',
    backgroundColor: 'white',
    fontSize: '0.9em',
};

const clearButtonStyle = {
    padding: '9px 18px', // Adjusted padding to match select height better
    border: 'none', // Removed border for a flatter look
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9em',
    transition: 'background-color 0.2s ease',
    // marginLeft: 'auto', // This will be handled by parent flex a`lignment if needed
};

// Common Task options
const COMMON_TASKS = [
    { value: "", label: "Any Task" }, { value: "text-generation", label: "Text Generation" },
    { value: "fill-mask", label: "Fill-Mask" }, { value: "token-classification", label: "Token Classification (NER)" },
    { value: "sentence-similarity", label: "Sentence Similarity" }, { value: "text-classification", label: "Text Classification" },
    { value: "summarization", label: "Summarization" }, { value: "translation", label: "Translation" },
    { value: "question-answering", label: "Question Answering" }, { value: "conversational", label: "Conversational" },
    { value: "text-to-image", label: "Text-to-Image" }, { value: "image-classification", label: "Image Classification" },
    { value: "object-detection", label: "Object Detection" }, { value: "automatic-speech-recognition", label: "Speech Recognition (ASR)" },
    { value: "text-to-speech", label: "Text-to-Speech (TTS)" }, { value: "feature-extraction", label: "Feature Extraction" },
];

// Common Library options
const COMMON_LIBRARIES = [
    { value: "", label: "Any Library" }, { value: "transformers", label: "Transformers" },
    { value: "diffusers", label: "Diffusers" }, { value: "timm", label: "TIMM" },
    { value: "spacy", label: "spaCy" }, { value: "sentence-transformers", label: "Sentence Transformers" },
    { value: "speechbrain", label: "SpeechBrain" }, { value: "stable-baselines3", label: "Stable Baselines3" },
];

function FilterControls({
    currentSortBy, onSortByChange,
    currentPipelineTag, onPipelineTagChange,
    currentLibrary, onLibraryChange,
    onClearFilters,
}) {
    return (
        <div style={filterContainerStyle}>
            <div style={filterGroupStyle}> {/* Wrapper for left/center aligned filters */}
                <div style={controlGroupStyle}>
                    <label htmlFor="pipeline-tag" style={labelStyle}>Task:</label>
                    <select id="pipeline-tag" value={currentPipelineTag} onChange={(e) => onPipelineTagChange(e.target.value)} style={selectStyle}>
                        {COMMON_TASKS.map(task => (<option key={task.value} value={task.value}>{task.label}</option>))}
                    </select>
                </div>
                <div style={controlGroupStyle}>
                    <label htmlFor="library" style={labelStyle}>Library:</label>
                    <select id="library" value={currentLibrary} onChange={(e) => onLibraryChange(e.target.value)} style={selectStyle}>
                        {COMMON_LIBRARIES.map(lib => (<option key={lib.value} value={lib.value}>{lib.label}</option>))}
                    </select>
                </div>
                <div style={controlGroupStyle}>
                    <label htmlFor="sort-by" style={labelStyle}>Sort by:</label>
                    <select id="sort-by" value={currentSortBy} onChange={(e) => onSortByChange(e.target.value)} style={selectStyle}>
                        <option value="downloads">Most Downloads</option>
                        <option value="likes">Most Likes</option>
                        <option value="lastModified">Recently Updated</option>
                    </select>
                </div>
            </div>

            {/* Clear Filters Button - justify-content: space-between on parent handles positioning */}
            <button 
                onClick={onClearFilters} 
                style={clearButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            >
                Clear All Filters
            </button>
        </div>
    );
}
export default FilterControls;