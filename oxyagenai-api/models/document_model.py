from sqlalchemy import Column, Integer, String, Float
from pgvector.sqlalchemy import Vector

from database.session import Base


class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    corpus_id = Column(Integer, index=True)
    url = Column(String)