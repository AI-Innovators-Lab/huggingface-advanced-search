import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Path
from fastapi.concurrency import run_in_threadpool

from ..services import hf_service
from ..schemas.model_schemas import ModelDetailResponse # Ensure this schema is defined

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get(
    "/{model_id_author}/{model_id_name}", # Matches the frontend route
    response_model=Optional[ModelDetailResponse], # Optional if model might not be found
    summary="Get Model Details",
    description="Fetches detailed information for a specific model, including its README and GGUF files."
)
async def get_single_model_details(
    model_id_author: str = Path(..., description="The author/organization part of the model ID."),
    model_id_name: str = Path(..., description="The name part of the model ID.")
    # If using wildcard "/model/*" route:
    # model_repo_id: str = Path(..., description="The full model repository ID, e.g., 'openai-community/gpt2'. Note: URL decode if necessary.")
):
    full_model_id = f"{model_id_author}/{model_id_name}"
    # If using wildcard: full_model_id = model_repo_id

    logger.info(f"Request received for model details: {full_model_id}")
    try:
        # get_model_details_from_hub involves file I/O (README download) and network calls.
        # Run it in a threadpool to keep the FastAPI event loop unblocked.
        model_details = await run_in_threadpool(hf_service.get_model_details_from_hub, model_id=full_model_id)
        
        if model_details is None:
            logger.warning(f"Model details not found for {full_model_id} by service.")
            raise HTTPException(status_code=404, detail=f"Model '{full_model_id}' not found.")
        
        logger.info(f"Successfully retrieved details for {full_model_id}")
        return model_details
    except HTTPException as http_exc: # Re-raise HTTPExceptions
        raise http_exc
    except Exception as e:
        logger.error(f"Error retrieving details for model {full_model_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An internal server error occurred while fetching details for model '{full_model_id}'.")

# If you want to support model IDs with more than one slash, like 'a/b/c'
# you'd use a path converter in the route:
# @router.get("/{model_repo_id:path}", ...)
# async def get_single_model_details_flexible(model_repo_id: str = Path(...)):
# full_model_id = model_repo_id
# ... rest of the logic ...
