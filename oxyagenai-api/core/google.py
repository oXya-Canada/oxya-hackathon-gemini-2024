from google.cloud import storage
from google.cloud import secretmanager
import google_crc32c

from fastapi import Depends
from loguru import logger



bucket_name = "docs-oxya-hackaton-2024"
storage_client = storage.Client()

import vertexai

from vertexai.generative_models import GenerativeModel, Part

SecretManagerClient = secretmanager.SecretManagerServiceClient()

class GoogleService:
    name = ""
    def __init__(self, name):
        self.name = name
        logger.info(f"Initializing GoogleService ")


    def get_secret(self):
        response = SecretManagerClient.access_secret_version(request={"name": self.name})
        crc32c = google_crc32c.Checksum()
        crc32c.update(response.payload.data)
        if response.payload.data_crc32c != int(crc32c.hexdigest(), 16):
            logger.error("Data corruption detected.")
            return response
        payload = response.payload.data.decode("UTF-8")
        return(payload)
