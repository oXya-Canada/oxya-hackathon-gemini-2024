
from loguru import logger
from typing import List, Dict
import requests
from fastapi import UploadFile
from starlette.responses import JSONResponse

import os
from core.config import settings
from core.vertexai import single_pdf
import tempfile


class PromptService:
    def __init__(self):

        logger.info("PromptService initialized.")

    async def single_pdf(
        self, url_file: str, prompt: str
    ) -> str:
        response = await single_pdf(prompt, url_file)
        return {"status": "success", "response":response}
        
    async def query_document(
        self, file: UploadFile
    ) -> str:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            filename = f"{file.filename}.{os.urandom(32).hex()}"
            logger.info(f"Downloading {filename} on local disk")
            contents = await file.read()
            temp_file.write(contents)

        return {"name": filename, "source_file":f"{temp_file.name}"}
    
