# HuggingFace Advanced Search & Comparison Hub

## Introduction

This project is a web application designed to provide an enhanced experience for searching, viewing details, and comparing machine learning models from the Hugging Face Hub. It offers advanced filtering options and a specific focus on GGUF model files, making it easier for users to find and evaluate models for their needs. The application features a React-based frontend and a Python FastAPI backend.

## Why Use This Project?

-   **Advanced Filtering:** Go beyond basic search with filters for sort order (downloads, likes, last modified), pipeline tasks, and specific libraries.
-   **GGUF Focus:** Easily identify models with GGUF files and view their details, including quantization and size. Provides guidance for models without GGUF files on how to potentially convert them.
-   **Model Comparison:** Select 2 or 3 models and view their metadata, summaries, and GGUF file details side-by-side for quick evaluation.
-   **Detailed Model View:** Access comprehensive model information, including the full README, card data, and file listings.
-   **Local & Self-Hostable:** Run the interface locally for a personalized and potentially faster experience.

## Key Features

-   **Model Search:** Search the Hugging Face Hub by query.
-   **Filter Controls:** Refine search results by:
    -   Sort By (Downloads, Likes, Trending, Recently Updated)
    -   Pipeline Tag (e.g., text-generation, image-classification)
    -   Library (e.g., transformers, diffusers)
-   **Model Detail Page:** Displays:
    -   Model ID, author, last modified date, downloads, likes.
    -   Pipeline tag and other tags.
    -   Extracted model card data (license, language, etc.).
    -   A list of GGUF files with name, quantization, size, and download links.
    -   A helpful hint with a link to a conversion guide if GGUF files are not present.
    -   Full model README content rendered as Markdown.
-   **Model Comparison Page:**
    -   Select 2 or 3 models from the search results.
    -   View a side-by-side comparison of their key details, including a summary extracted from their READMEs and GGUF file information.
-   **Pagination:** Navigate through search results.
-   **Session Persistence:** Search state (query, filters, current page, results) is saved in session storage to retain context across page reloads within the same session.

## Tech Stack

-   **Frontend:**
    -   React (v19)
    -   Vite
    -   React Router (v6/v7 for client-side routing)
    -   Axios (for API requests)
    -   `react-markdown`, `remark-gfm`, `rehype-sanitize` (for rendering READMEs)
    -   `react-syntax-highlighter` (for code block styling in READMEs)
-   **Backend:**
    -   Python (3.11+)
    -   FastAPI (for building the API)
    -   Uvicorn (ASGI server)
    -   `huggingface_hub` (Python client library for interacting with the Hub)
-   **Development:**
    -   ESLint (for frontend linting)
    -   Concurrently (to run frontend and backend simultaneously)

## Folder Structure

```
huggingface-advanced-search/
├── backend/                 # FastAPI backend application
│   ├── app/                 # Main application code
│   │   ├── core/            # Core settings, configurations
│   │   ├── routers/         # API endpoint definitions
│   │   ├── schemas/         # Pydantic models for data validation
│   │   ├── services/        # Business logic (e.g., Hugging Face API interaction)
│   │   └── main.py          # FastAPI app initialization
│   ├── tests/               # Backend tests
│   ├── requirements.txt     # Python dependencies
│   └── .gitignore           # Backend specific gitignore
│   └── Dockerfile           # (Optional, if you plan to containerize)
├── frontend/                # React frontend application (Vite)
│   ├── public/              # Static assets
│   ├── src/                 # Frontend source code
│   │   ├── assets/          # Image assets, etc.
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page-level components (HomePage, ModelDetailPage, etc.)
│   │   ├── services/        # API interaction service (api.js)
│   │   ├── App.jsx          # Main App component with routing
│   │   └── main.jsx         # Entry point for the React app
│   ├── .gitignore           # Frontend specific gitignore (should ignore node_modules/)
│   ├── package.json         # Frontend dependencies and scripts (MUST be committed)
│   ├── package-lock.json    # Exact versions of frontend dependencies (MUST be committed)
│   └── vite.config.js       # Vite configuration
├── .gitignore               # Root gitignore
└── README.md                # This file
```

## Prerequisites

-   Node.js (v18 or later recommended) and npm (usually comes with Node.js)
-   Python (v3.11 or later recommended) and pip

## Setup & Running

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd huggingface-advanced-search
    ```

2.  **Backend Setup:**
    ```bash
    cd backend

    # Create and activate a virtual environment
    # On macOS/Linux:
    python3 -m venv venv
    source venv/bin/activate
    # On Windows:
    # python -m venv venv
    # .\venv\Scripts\activate

    # Install dependencies
    pip install -r requirements.txt

    # (Optional) If you have a Hugging Face token and want to use it for authenticated requests
    # (especially for private models or higher rate limits), create a .env file in the 'backend' directory:
    # HF_TOKEN="your_hugging_face_token_here"

    # Run the backend server
    uvicorn app.main:app --reload --port 8000
    ```
    The backend will be available at `http://127.0.0.1:8000`.

3.  **Frontend Setup:**
    Open a new terminal window/tab.
    ```bash
    cd frontend

    # Install dependencies (relies on package.json and package-lock.json from the repo)
    npm install

    # Run the frontend development server
    npm run dev
    ```
    The frontend will be available at `http://localhost:5175` (or another port if 5175 is busy, check your terminal output).
    **Important:** The `node_modules/` folder will be generated locally by `npm install` and should *not* be in your Git repository. `package.json` and `package-lock.json` *must* be in the repository for this step to work.

4.  **Running Both (using concurrently - from `frontend` directory):**
    Ensure the backend virtual environment (`venv`) is active in the terminal where you run this command, or that `uvicorn` is globally accessible.
    From the `frontend` directory:
    ```bash
    # For macOS/Linux
    # npm run dev:all

    # For Windows
    npm run dev:all:win
    ```
    This will start both the Vite dev server and the Uvicorn backend server.

## Using the Application

1.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:5175`).
2.  Use the search bar to find models.
3.  Apply filters using the dropdowns for Sort By, Pipeline Tag, and Library.
4.  Click on a model in the list to view its detailed information.
    - If a model lacks GGUF files, a hint will guide you on potential conversion methods.
5.  On the search results page, check the boxes next to 2 or 3 models and click "Compare Selected" to see a side-by-side comparison.

## API Endpoints (Backend)

The backend exposes the following main endpoints:

-   `GET /api/search/models`: Searches for models based on query parameters (query, sort_by, page, page_size, pipeline_tag, library).
-   `GET /api/models/{author}/{name}`: Retrieves detailed information for a specific model.
-   `GET /api/models/{author}/{name}/config`: Retrieves the configuration for a specific model.
-   `GET /api/models/{author}/{name}/gguf`: Retrieves GGUF file information for a specific model.
-   `GET /api/meta/pipeline-tags`: Retrieves a list of available pipeline tags.
-   `GET /api/meta/libraries`: Retrieves a list of available libraries.

(The frontend primarily uses the first two for search and details, and the last two for filter options).


