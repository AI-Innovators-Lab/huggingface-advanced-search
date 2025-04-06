import logging
from typing import List, Optional, Tuple
from huggingface_hub import list_models, HfApi
from huggingface_hub.hf_api import ModelInfo
from ..schemas.search_schemas import HFModelSearchResultItem # Corrected relative import
from huggingface_hub import hf_hub_download, model_info as hf_model_info # Alias to avoid conflict
from ..schemas.model_schemas import ModelDetailResponse, GGUFFileDetail, ModelCardData # Corrected relative import
import re # For regex-based keyword extraction

logger = logging.getLogger(__name__)

# Define known task keywords and their corresponding pipeline_tags
# This list can be expanded. Keys are lowercase.
TASK_KEYWORD_TO_PIPELINE_TAG = {
    "text generation": "text-generation",
    "summarization": "summarization",
    "translation": "translation",
    "question answering": "question-answering",
    "fill mask": "fill-mask",
    "fill-mask": "fill-mask",
    "text classification": "text-classification",
    "token classification": "token-classification",
    "image classification": "image-classification",
    "object detection": "object-detection",
    "image segmentation": "image-segmentation",
    "text to image": "text-to-image",
    "text-to-image": "text-to-image",
    "image to text": "image-to-text",
    "image-to-text": "image-to-text",
    "text to speech": "text-to-speech",
    "text-to-speech": "text-to-speech",
    "audio to audio": "audio-to-audio",
    "automatic speech recognition": "automatic-speech-recognition",
    "asr": "automatic-speech-recognition",
    "voice activity detection": "voice-activity-detection",
    "reinforcement learning": "reinforcement-learning",
    "robotics": "robotics",
    "tabular classification": "tabular-classification",
    "tabular regression": "tabular-regression",
    "table question answering": "table-question-answering",
    "visual question answering": "visual-question-answering",
    "vqa": "visual-question-answering",
    "document question answering": "document-question-answering",
    "zero shot classification": "zero-shot-classification",
    "zero-shot-classification": "zero-shot-classification",
    "zero shot image classification": "zero-shot-image-classification",
    "conversational": "conversational",
    "feature extraction": "feature-extraction",
    # Add more mappings as needed
}


def search_models_on_hub_paginated(
    query: Optional[str] = None,
    sort_by: str = "downloads",
    page: int = 1,          # New: current page number (1-indexed)
    page_size: int = 20,    # New: items per page
    pipeline_tag: Optional[str] = None,
    library: Optional[str] = None,
) -> Tuple[List[HFModelSearchResultItem], int, bool]: # Results, total_items_on_this_page_and_before, has_more
    
    processed_query = query
    derived_pipeline_tag = pipeline_tag 

    if query and not pipeline_tag: 
        query_lower = query.lower()
        sorted_task_keywords = sorted(TASK_KEYWORD_TO_PIPELINE_TAG.keys(), key=len, reverse=True)
        for task_keyword in sorted_task_keywords:
            pt_value = TASK_KEYWORD_TO_PIPELINE_TAG[task_keyword]
            if re.search(r'\b' + re.escape(task_keyword) + r'\b', query_lower):
                derived_pipeline_tag = pt_value
                logger.info(f"Derived pipeline_tag '{derived_pipeline_tag}' from query keyword '{task_keyword}'.")
                if processed_query:
                    processed_query = re.sub(r'\b' + re.escape(task_keyword) + r'\b', '', processed_query, flags=re.IGNORECASE).strip()
                if not processed_query: 
                    processed_query = None
                logger.info(f"Removed task keyword '{task_keyword}' from query. New processed_query for search: '{processed_query}'")
                break 
    
    try:
        logger.info(
            f"Searching Hub (paginated): query='{processed_query}', sort='{sort_by}', "
            f"page={page}, page_size={page_size}, pipeline_tag='{derived_pipeline_tag}', library='{library}'"
        )
        
        valid_sort_fields = ["downloads", "likes", "lastModified"]
        if sort_by not in valid_sort_fields:
            sort_by = "downloads"

        # Calculate start and end indices for the current page
        start_index = (page - 1) * page_size
        end_index = start_index + page_size

        paged_results: List[HFModelSearchResultItem] = []
        models_iterator = list_models( # This returns a generator
            search=processed_query if processed_query else None,
            sort=sort_by,
            direction=-1,
            full=True, # Still need full info for each item
            pipeline_tag=derived_pipeline_tag,