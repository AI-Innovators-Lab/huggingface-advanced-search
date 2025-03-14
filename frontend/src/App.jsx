// frontend/src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import Page Components & Regular Components
import ModelDetailPage from './pages/ModelDetailPage'; 
import ModelComparisonPage from './pages/ModelComparisonPage'; // Import the comparison page
import SearchBar from './components/SearchBar';
import FilterControls from './components/FilterControls';
import ModelList from './components/ModelList';
import PaginationControls from './components/PaginationControls';
import { searchModels } from './services/api';
import './App.css'; 

// --- Styles (can be moved to CSS files) ---
const appContainerStyle = {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f4f7f6',
    minHeight: '100vh',
};

const simpleNavStyle = {
    backgroundColor: 'rgba(44, 62, 80, 0.9)',
    padding: '15px 0',
    marginBottom: '30px',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
};

const navTitleStyle = {
    textAlign: 'center',
    color: 'yellow', 
    fontSize: '1.8em',
    margin: 0,
    fontWeight: '600',
    textShadow: '1px 1px 2px white',
};

const centeredMessageStyle = {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: '20px',
    padding: '20px 0',
};

const errorStyle = {
    ...centeredMessageStyle,
    color: 'red',
    fontWeight: 'bold',
};
// --- End Styles ---

const PAGE_SIZE = 20;
const SESSION_STORAGE_KEY = 'hfSearchHomePageState';

// Default filter values
const DEFAULT_QUERY = '';
const DEFAULT_SORT_BY = 'downloads';
const DEFAULT_PIPELINE_TAG = '';
const DEFAULT_LIBRARY = '';

// --- HomePage Component ---
function HomePage() {
    const navigate = useNavigate(); 
    const [models, setModels] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.models || []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.error || null);
    
    const [currentQuery, setCurrentQuery] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.currentQuery || DEFAULT_QUERY);
    const [currentSortBy, setCurrentSortBy] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.currentSortBy || DEFAULT_SORT_BY);
    const [currentPipelineTag, setCurrentPipelineTag] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.currentPipelineTag || DEFAULT_PIPELINE_TAG);
    const [currentLibrary, setCurrentLibrary] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.currentLibrary || DEFAULT_LIBRARY);
    
    const [currentPage, setCurrentPage] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.currentPage || 1);
    const [hasNextPage, setHasNextPage] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.hasNextPage || false);

    const [displayQueryInfo, setDisplayQueryInfo] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.displayQueryInfo || '');
    const [hasSearchedAtLeastOnce, setHasSearchedAtLeastOnce] = useState(() => JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))?.hasSearchedAtLeastOnce || false);

    const [selectedForComparison, setSelectedForComparison] = useState([]);

    const handleToggleCompare = useCallback((modelId) => {
        setSelectedForComparison(prevSelected => {
            if (prevSelected.includes(modelId)) {
                return prevSelected.filter(id => id !== modelId);
            } else {
                if (prevSelected.length < 3) { 
                    return [...prevSelected, modelId];
                }
                alert("You can select a maximum of 3 models for comparison.");
                return prevSelected;
            }
        });
    }, []);

    const performSearch = useCallback(async (searchConfig, pageToFetch) => {
        setIsLoading(true);
        const effectiveSearchConfig = { 
            query: searchConfig.query !== undefined ? searchConfig.query : currentQuery,
            sortBy: searchConfig.sortBy !== undefined ? searchConfig.sortBy : currentSortBy,
            pipelineTag: searchConfig.pipelineTag !== undefined ? searchConfig.pipelineTag : currentPipelineTag,
            library: searchConfig.library !== undefined ? searchConfig.library : currentLibrary,
        };
        if (!hasSearchedAtLeastOnce) setHasSearchedAtLeastOnce(true);
        const paramsToSearch = { ...effectiveSearchConfig, page: pageToFetch, pageSize: PAGE_SIZE };
        let queryParts = [];
        if (paramsToSearch.query) queryParts.push(`"${paramsToSearch.query}"`); else queryParts.push("All Models");
        if (paramsToSearch.pipelineTag) queryParts.push(`Task: ${paramsToSearch.pipelineTag}`);
        if (paramsToSearch.library) queryParts.push(`Library: ${paramsToSearch.library}`);
        const newDisplayQueryInfo = queryParts.join(' | ');

        try {
            setError(null); 
            const apiParams = {
                query: paramsToSearch.query || undefined,
                sortBy: paramsToSearch.sortBy,
                page: paramsToSearch.page,
                pageSize: paramsToSearch.pageSize,
                pipelineTag: paramsToSearch.pipelineTag || undefined,
                library: paramsToSearch.library || undefined,
            };
            const data = await searchModels(apiParams);
            const newModels = data.results || [];
            const newHasNextPage = data.has_more || false;
            setModels(newModels); setHasNextPage(newHasNextPage);
            setCurrentPage(pageToFetch); setDisplayQueryInfo(newDisplayQueryInfo);
            setSelectedForComparison([]); 
            const stateToSave = {
                models: newModels, currentQuery: effectiveSearchConfig.query,
                currentSortBy: effectiveSearchConfig.sortBy, currentPipelineTag: effectiveSearchConfig.pipelineTag,
                currentLibrary: effectiveSearchConfig.library, currentPage: pageToFetch,
                hasNextPage: newHasNextPage, displayQueryInfo: newDisplayQueryInfo,
                hasSearchedAtLeastOnce: true, error: null
            };
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch models.';
            setError(errorMsg); setModels([]); setHasNextPage(false);
            setDisplayQueryInfo(newDisplayQueryInfo); setCurrentPage(pageToFetch); 
            const stateToSaveOnError = {
                models: [], currentQuery: effectiveSearchConfig.query,
                currentSortBy: effectiveSearchConfig.sortBy, currentPipelineTag: effectiveSearchConfig.pipelineTag,
                currentLibrary: effectiveSearchConfig.library, currentPage: pageToFetch,
                hasNextPage: false, displayQueryInfo: newDisplayQueryInfo,
                hasSearchedAtLeastOnce: true, error: errorMsg
            };
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stateToSaveOnError));
        } finally { setIsLoading(false); }
    }, [currentQuery, currentSortBy, currentPipelineTag, currentLibrary, hasSearchedAtLeastOnce]);

    const handleSearchSubmit = useCallback((searchData) => { 
        const newQuery = searchData.query || '';
        performSearch({ query: newQuery, sortBy: currentSortBy, pipelineTag: currentPipelineTag, library: currentLibrary }, 1);
    }, [currentSortBy, currentPipelineTag, currentLibrary, performSearch]);

    const handleSortByChange = useCallback((newSortBy) => {
        performSearch({ query: currentQuery, sortBy: newSortBy, pipelineTag: currentPipelineTag, library: currentLibrary }, 1);
    }, [currentQuery, currentPipelineTag, currentLibrary, performSearch]);

    const handlePipelineTagChange = useCallback((newPipelineTag) => {
        performSearch({ query: currentQuery, sortBy: currentSortBy, pipelineTag: newPipelineTag, library: currentLibrary }, 1);
    }, [currentQuery, currentSortBy, currentLibrary, performSearch]);

    const handleLibraryChange = useCallback((newLibrary) => {
        performSearch({ query: currentQuery, sortBy: currentSortBy, pipelineTag: currentPipelineTag, library: newLibrary }, 1);
    }, [currentQuery, currentSortBy, currentPipelineTag, performSearch]);
    
    const goToNextPage = useCallback(() => {
        if (hasNextPage && !isLoading) {
            performSearch({ query: currentQuery, sortBy: currentSortBy, pipelineTag: currentPipelineTag, library: currentLibrary }, currentPage + 1);
        }
    }, [hasNextPage, isLoading, currentPage, currentQuery, currentSortBy, currentPipelineTag, currentLibrary, performSearch]);

    const goToPreviousPage = useCallback(() => {
        if (currentPage > 1 && !isLoading) {
            performSearch({ query: currentQuery, sortBy: currentSortBy, pipelineTag: currentPipelineTag, library: currentLibrary }, currentPage - 1);
        }
    }, [isLoading, currentPage, currentQuery, currentSortBy, currentPipelineTag, currentLibrary, performSearch]);

    const handleClearFilters = useCallback(() => {
        setCurrentQuery(DEFAULT_QUERY); setCurrentSortBy(DEFAULT_SORT_BY);
        setCurrentPipelineTag(DEFAULT_PIPELINE_TAG); setCurrentLibrary(DEFAULT_LIBRARY);
        setModels([]); setHasSearchedAtLeastOnce(false); setDisplayQueryInfo('');
        setCurrentPage(1); setHasNextPage(false); setError(null);
        setSelectedForComparison([]); 
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }, []);

    const handleNavigateToCompare = () => {
        if (selectedForComparison.length >= 2) {
            const modelIdsToCompare = selectedForComparison.map(id => encodeURIComponent(id)).join(',');
            navigate(`/compare/${modelIdsToCompare}`);
        } else {
            alert("Please select at least 2 models to compare.");
        }
    };

    useEffect(() => {
        const storedState = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
        if (storedState) {
            // States are already initialized via useState callbacks
        }
    }, []); 

    return (
        <>
            <SearchBar 
                onSearch={handleSearchSubmit} 
                isLoading={isLoading}
                initialQuery={currentQuery} 
            />
            <FilterControls
                currentSortBy={currentSortBy} onSortByChange={handleSortByChange}
                currentPipelineTag={currentPipelineTag} onPipelineTagChange={handlePipelineTagChange}
                currentLibrary={currentLibrary} onLibraryChange={handleLibraryChange}
                onClearFilters={handleClearFilters}
            />
            {selectedForComparison.length >= 2 && (
                <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '10px' }}>
                    <button 
                        onClick={handleNavigateToCompare}
                        style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Compare Selected ({selectedForComparison.length})
                    </button>
                </div>
            )}
            {isLoading && <p style={centeredMessageStyle}>Loading models...</p>}
            {!isLoading && error && <p style={errorStyle}>Error: {error}</p>}
            {!isLoading && !error && hasSearchedAtLeastOnce && (
                <>
                    {models.length > 0 ? (
                        <>
                            <p style={centeredMessageStyle}>
                                Showing results for: <strong>{displayQueryInfo}</strong> (Page {currentPage})
                            </p>
                            <ModelList 
                                models={models} 
                                selectedForComparison={selectedForComparison}
                                onToggleCompare={handleToggleCompare}    
                            />
                            <PaginationControls
                                currentPage={currentPage} hasNextPage={hasNextPage}
                                onNextPage={goToNextPage} onPreviousPage={goToPreviousPage}
                            />
                        </>
                    ) : (
                        <p style={centeredMessageStyle}>
                            No models found for "<strong>{displayQueryInfo}</strong>". Try a different search or adjust filters.
                        </p>
                    )}
                </>
            )}
            {!isLoading && !error && !hasSearchedAtLeastOnce && (
                <p style={centeredMessageStyle}>
                    Enter a query, select filters, and click Search to find Hugging Face models.
                </p>
            )}
        </>
    );
}
// --- End HomePage Component ---

// --- Main App Component (Handles Routing and Global Layout) ---
function App() { 
    return (
        <>
            <nav style={simpleNavStyle}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 style={navTitleStyle}>HuggingFace Model Hub</h1>
                </Link>
            </nav>
            <div style={appContainerStyle}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/model/:modelIdAuthor/:modelIdName" element={<ModelDetailPage />} />
                    <Route path="/compare/:modelIds" element={<ModelComparisonPage />} /> {/* Route for comparison */}
                </Routes>
            </div>
        </>
    );
}
export default App;