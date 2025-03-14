import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getModelDetails } from '../services/api';
import ModelDetailPageContent from './ModelDetailPageContent'; // We'll create this to reuse detail rendering

// --- Styles ---
const comparisonPageStyle = {
    padding: '20px',
};
const pageTitleStyle = {
    textAlign: 'center',
    fontSize: '2em',
    color: '#333',
    marginBottom: '30px',
};
const modelsContainerStyle = {
    display: 'flex',
    flexDirection: 'row', // Arrange models side-by-side
    gap: '20px',          // Space between model columns
    alignItems: 'flex-start', // Align tops of model cards
    overflowX: 'auto',    // Allow horizontal scrolling if too many models
};
const modelColumnStyle = {
    flex: '1 1 300px', // Each model takes up space, min 300px, can grow/shrink
    minWidth: '300px', // Minimum width for a model column
    maxWidth: '450px', // Maximum width to prevent one column from becoming too wide
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
};
const loadingErrorStyle = {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2em',
};

function ModelComparisonPage() {
    const { modelIds: modelIdsString } = useParams();
    const [modelsData, setModelsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!modelIdsString) {
            setError("No model IDs provided for comparison.");
            setIsLoading(false);
            return;
        }

        const ids = modelIdsString.split(',');
        if (ids.length < 2 || ids.length > 3) {
            setError("Please select 2 or 3 models to compare.");
            setIsLoading(false);
            return;
        }

        const fetchAllModelDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const promises = ids.map(id => getModelDetails(id.trim()));
                const results = await Promise.allSettled(promises);
                
                const fetchedModels = [];
                const fetchErrors = [];

                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        fetchedModels.push(result.value);
                    } else {
                        fetchErrors.push(`Failed to load details for ${ids[index]}: ${result.reason?.message || 'Unknown error'}`);
                        fetchedModels.push({ id: ids[index], error: result.reason?.message || 'Failed to load' }); // Add placeholder for errored model
                    }
                });

                setModelsData(fetchedModels);
                if (fetchErrors.length > 0) {
                    // Optionally set a partial error state or log it
                    console.warn("Some models could not be loaded for comparison:", fetchErrors);
                }

            } catch (err) {
                console.error("Error fetching models for comparison:", err);
                setError("An unexpected error occurred while fetching model details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllModelDetails();
    }, [modelIdsString]);

    if (isLoading) return <div style={loadingErrorStyle}>Loading models for comparison...</div>;
    if (error) return <div style={{ ...loadingErrorStyle, color: 'red' }}>Error: {error}</div>;
    if (modelsData.length === 0 && !isLoading) return <div style={loadingErrorStyle}>No model data to display.</div>;

    return (
        <div style={comparisonPageStyle}>
            <h1 style={pageTitleStyle}>Model Comparison</h1>
            <div style={modelsContainerStyle}>
                {modelsData.map((model, index) => (
                    <div key={model.id || `error-${index}`} style={modelColumnStyle}>
                        {model.error ? (
                            <div>
                                <h2>{model.id}</h2>
                                <p style={{color: 'red'}}>Could not load details: {model.error}</p>
                            </div>
                        ) : (
                            // We'll use a new component ModelDetailPageContent to render details
                            // This avoids duplicating all the rendering logic from ModelDetailPage
                            <ModelDetailPageContent modelDetails={model} isComparisonView={true} />
                        )}
                    </div>
                ))}
            </div>
            <Link to="/" 
                style={{ display: 'inline-block', marginTop: '30px', padding: '10px 15px',
                         backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', 
                         fontWeight: 'bold', borderRadius: '4px', transition: 'background-color 0.2s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}>
                « Back to Search
            </Link>
        </div>
    );
}

export default ModelComparisonPage;