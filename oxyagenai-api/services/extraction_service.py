
from loguru import logger
from typing import List, Dict
import requests
from fastapi import UploadFile
from starlette.responses import JSONResponse
from core.vertexai import uploadFile2GCS
import os
from core.config import settings

import tempfile


class ExtractionService:

    def __init__(self, access_token: str):

        logger.info("ExtractionService initialized.")

    async def save_file(
        self, file: UploadFile
    ) -> str:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            filename = f"{file.filename}.{os.urandom(32).hex()}"
            logger.info(f"Downloading {filename} on local disk")
            contents = await file.read()
            temp_file.write(contents)

        return {"filename": filename, "source_file":f"{temp_file.name}"}
    
    async def file2gcs(
        self, temp_file_name: str, filename: str
    ) -> str:
        try:
            docUrl = await uploadFile2GCS(temp_file_name, filename)
            logger.info(f"File {filename} saved on GCS")
        except Exception as e:
            logger.error("Error during uploadFile2GCS")
            return JSONResponse(status_code=500, content={"message": f"Error uploading file: {e}"})
        return {"filename": filename, "source_file":f"{temp_file_name}", "url":docUrl}    
