import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from loguru import logger
import sys
from core.google import GoogleService
import json 

secret_name = os.environ.get('SECRET_NAME')
_googleService = GoogleService(secret_name)
_google = json.loads(_googleService.get_secret())
logger.info(f"Config {_google}")

class Settings(BaseSettings):
    API_VERSION: str = "v1"
    API_V1_STR: str = f"/api/{API_VERSION}"
    DB_HOST: str = _google["db_host"]
    
    DB_PORT: str = _google["db_port"]
    DB_NAME: str = _google["db_name"]
    DB_PASS: str = _google["db_pass"]
    DB_USER: str = _google["db_user"]

    llm_model_name: str = _google["llm_model_name"]
    embedding_model_name: str = _google["embedding_model_name"]
    gemini_settings: str = json.dumps(_google["gemini_settings"])
    chunk_size: int = _google["chunk_size"]
    chunk_overlap: int = _google["chunk_overlap"]
    max_output_tokens: int = _google["max_output_tokens"]
    temperature: float = _google["temperature"]
    top_p: float = _google["top_p"]
    top_k: int = _google["top_k"]
    requests_per_minute: int = _google["requests_per_minute"]
    num_instances_per_batch: int = _google["num_instances_per_batch"] 
    project_id: str = _google["project_id"]
    location: str = _google["location"]
    bucket_name: str = _google["bucket_name"]
    sql_instance_name: str = _google["sql_instance_name"]

    @property
    def DATABASE_URI(self) -> str:
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def ASYNC_DATABASE_URI(self) -> str:
        return f"postgresql+psycopg_async://{self.DB_USER}:{self.DB_PASS}@/{self.DB_NAME}?host={self.DB_HOST}"
        #return f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASS}@/{self.DB_NAME}?host=/cloudsql/oxya-hackaton-2024:northamerica-northeast1:oxyavector"


    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")



class LogConfig:
    LOGGING_LEVEL = "DEBUG"
    LOGGING_FORMAT = "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | <level>{message}</level>"

    @staticmethod
    def configure_logging():
        logger.remove()

        logger.add(
            sys.stderr, format=LogConfig.LOGGING_FORMAT, level=LogConfig.LOGGING_LEVEL
        )


LogConfig.configure_logging()

settings = Settings()




