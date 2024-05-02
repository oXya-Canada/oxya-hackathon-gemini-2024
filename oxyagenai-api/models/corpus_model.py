from sqlalchemy import Column, Integer, String, Float
from sqlmodel import SQLModel, SQLModel, Field
from pgvector.sqlalchemy import Vector

class CorpusBase(SQLModel):
    name: str = Field(index=True)
    description: str


class Corpus(CorpusBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class CorpusCreate(CorpusBase):
    pass


class CorpusPublic(CorpusBase):
    id: int


class CorpusUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
