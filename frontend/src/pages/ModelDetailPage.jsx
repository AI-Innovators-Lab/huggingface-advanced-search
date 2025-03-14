// frontend/src/pages/ModelDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getModelDetails } from '../services/api';
import ModelDetailPageContent from './ModelDetailPageContent'; // Import the content component

// --- Styles for ModelDetailPage container ---
const detailContainerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginTop: '20px',
    marginBottom: '30px',
};
const loadingErrorStyle = {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2em'
};
const backLinkStyle = {
    display: 'inline-block',
    marginTop: '30px',
    padding: '10px 15px',
    backgroundColor: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
};

function ModelDetailPage() {
    const { modelIdAuthor, modelIdName } = useParams();
    const modelId = `${modelIdAuthor}/${modelIdName}`;
    const [modelDetails, setModelDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if modelId parts are valid before constructing
        if (!modelIdAuthor || !modelIdName || modelIdAuthor === "undefined" || modelIdName === "undefined") {
            setError("Invalid model ID parameters provided.");
            setIsLoading(false);
            return;
        }
        
        const fetchDetails = async () => {
            setIsLoading(true); 
            setError(null);
            try {
                const data = await getModelDetails(modelId);
                setModelDetails(data);
            } catch (err) {
                setError(err.response?.data?.detail || err.message || `Failed to fetch details for ${modelId}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [modelId, modelIdAuthor, modelIdName]); // modelId will change if author/name changes

    if (isLoading) return <div style={loadingErrorStyle}>Loading model details...</div>;
    if (error) return <div style={{ ...loadingErrorStyle, color: 'red' }}>Error: {error}</div>;
    if (!modelDetails) return <div style={loadingErrorStyle}>Model not found or no details available.</div>;

    return (
        <div style={detailContainerStyle}>
            <ModelDetailPageContent modelDetails={modelDetails} isComparisonView={false} />
            
            <Link 
                to="/" 
                style={backLinkStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}>
                « Back to Search
            </Link>
        </div>
    );
}
export default ModelDetailPage;