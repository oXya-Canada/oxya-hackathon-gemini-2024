from google.cloud import storage
from google.cloud import secretmanager
import google_crc32c

from fastapi import Depends
from loguru import logger
from core.config import settings


bucket_name = "docs-oxya-hackaton-2024"
storage_client = storage.Client()

import vertexai

from vertexai.generative_models import GenerativeModel, Part

async def get_secret():
    from google.cloud import secretmanager
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{settings.project_id}/secrets/{settings.secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    crc32c = google_crc32c.Checksum()
    crc32c.update(response.payload.data)
    if response.payload.data_crc32c != int(crc32c.hexdigest(), 16):
        logger.error("Data corruption detected.")
        return response
    payload = response.payload.data.decode("UTF-8")
    return(payload)

#https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/send-multimodal-prompts#pdf
async def single_pdf(prompt: str, pdf_file_uri: str):
    vertexai.init(project=settings.project_id, location=settings.location)
    model = GenerativeModel(model_name="gemini-1.5-pro-preview-0409")

    pdf_file =  Part.from_uri(pdf_file_uri, mime_type="application/pdf")
    contents = [pdf_file, prompt]

    response = model.generate_content(contents)
    return (response.text)


async def uploadFile2GCS(source_file_name, destination_name):
    logger.info("uploadFile2GCS")
    bucket = storage_client.bucket(settings.bucket_name)
    blob = bucket.blob(destination_name)
    generation_match_precondition = 0
    blob.upload_from_filename(source_file_name, if_generation_match=generation_match_precondition)
    link = blob.path_helper(settings.bucket_name, destination_name)
    logger.info(f"File gs://{link}")
    return f"gs://{settings.bucket_name}/{destination_name}"
