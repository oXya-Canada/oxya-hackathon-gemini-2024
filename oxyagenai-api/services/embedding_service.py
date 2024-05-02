from abc import ABC, abstractmethod
from typing import List
import numpy as np
from loguru import logger

from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
from core.config import settings


class EmbeddingGenerator(ABC):
    @abstractmethod
    async def generate_embeddings(self, text: str) -> List[float]:
        pass


class VertexAIEmbeddingService(EmbeddingGenerator):
    def __init__(self):
        logger.info(f"Initializing VertexAIEmbeddingService with model: {settings.embedding_model_name}")


    async def generate_embeddings(self, chunk):
        # Split the input text into chunks that do not exceed the model's token limit
        logger.info("VertexAIEmbeddingService : generate_embeddings")
        model = TextEmbeddingModel.from_pretrained(settings.embedding_model_name)

        kwargs = (
            dict(output_dimensionality=768)
        )


        inputs = TextEmbeddingInput(task_type="RETRIEVAL_DOCUMENT", text=chunk, title="")
        embeddings = model.get_embeddings([inputs])
        embedding_val = embeddings[0].values


        return embeddings[0].values


