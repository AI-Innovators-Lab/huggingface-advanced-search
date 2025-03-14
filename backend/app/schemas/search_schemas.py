from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional, Any
from datetime import datetime

class HFModelSearchResultItem(BaseModel):
    id: str = Field(..., description="The unique model ID, e.g., 'gpt2' or 'google/flan-t5-base'.")
    author: Optional[str] = Field(None, description="The author or organization of the model.")
    last_modified: datetime = Field(..., alias="lastModified", description="Timestamp of the last modification.")
    likes: int = Field(0, description="Number of likes the model has received.")
    private: bool = Field(False, description="Whether the model is private.")
    downloads: int = Field(0, description="Number of downloads in the last month.")
    tags: List[Any] = Field([], description="List of tags associated with the model (e.g., task, library, language).")
    pipeline_tag: Optional[str] = Field(None, alias="pipelineTag", description="The primary pipeline tag (task) for the model.")
    has_gguf: Optional[bool] = Field(False, description="Indicates if GGUF format files were detected for this model.")

    class Config:
        populate_by_name = True # Allows using alias names for populating the model
        from_attributes = True # Allows creating Pydantic models from ORM objects or other attribute-based objects

class HFModelSearchResponsePaginated(BaseModel): # New or updated schema
    query: Optional[str]
    sort_by: str
    page: int
    page_size: int
    results: List[HFModelSearchResultItem]
    # total_items_processed_for_has_more: int # Count of items iterated to determine has_more
    has_more: bool # Indicates if there are more pages available
    # total_results_available: Optional[int] = None # True total is hard to get without full iteration

class AutocompleteSuggestion(BaseModel):
    id: str
    # name: str # Or just use id if it's descriptive enough for autocomplete 
