import React from 'react';

const paginationContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
    marginBottom: '20px',
    gap: '10px',
};

const buttonStyle = {
    padding: '10px 18px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.2s ease',
};

const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    borderColor: '#ccc',
    cursor: 'not-allowed',
};

const pageInfoStyle = {
    fontSize: '1em',
    fontWeight: 'bold',
    minWidth: '100px', // Ensure some space for "Page X"
    textAlign: 'center',
};

function PaginationControls({ currentPage, hasNextPage, onNextPage, onPreviousPage, isLoading }) {
    return (
        <div style={paginationContainerStyle}>
            <button
                onClick={onPreviousPage}
                disabled={currentPage <= 1 || isLoading}
                style={currentPage <= 1 || isLoading ? disabledButtonStyle : buttonStyle}
            >
                « Previous
            </button>
            <span style={pageInfoStyle}>Page {currentPage}</span>
            <button
                onClick={onNextPage}
                disabled={!hasNextPage || isLoading}
                style={!hasNextPage || isLoading ? disabledButtonStyle : buttonStyle}
            >
                Next »
            </button>
        </div>
    );
}

export default PaginationControls;