from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class GGUFFileDetail(BaseModel):
    name: str
    url: str # This will be the direct download URL
    size_bytes: Optional[int] = None
    # Add parsed info later like quantization, variant
    quantization: Optional[str] = None 

class ModelCardData(BaseModel): # A simplified representation
    license: Optional[str] = None
    language: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    # Add other common model card fields you want to extract/display
    # This can be more dynamic: model_card: Optional[Dict[str, Any]] = None
    model_index: Optional[List[Dict[str, Any]]] = None # For evaluation results
    # For full flexibility, you could use:
    # card_data_raw: Optional[Dict[str, Any]] = None


class ModelDetailResponse(BaseModel):
    id: str
    author: Optional[str] = None
    last_modified: Optional[datetime] = Field(None, alias="lastModified")
    tags: Optional[List[str]] = []
    pipeline_tag: Optional[str] = Field(None, alias="pipelineTag")
    downloads: Optional[int] = 0
    likes: Optional[int] = 0
    
    readme_content: Optional[str] = "README not found."
    gguf_files: List[GGUFFileDetail] = []
    card_data: Optional[ModelCardData] = None # Using our simplified card data schema
    # Or for full card data:
    # card_data_raw: Optional[Dict[str, Any]] = None

    siblings: Optional[List[Dict[str, Any]]] = [] # List of all files in the repo with basic info

    class Config:
        populate_by_name = True
        from_attributes = True 
