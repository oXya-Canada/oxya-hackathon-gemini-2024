from typing import Any, Union, Optional
from sqlalchemy.orm import DeclarativeBase
from pydantic import BaseModel


def _extract_matching_columns_from_schema(
    model: type[DeclarativeBase], schema: Optional[Union[type[BaseModel], list]]
) -> list[Any]:
    column_list = list(model.__table__.columns)
    if schema is not None:
        if isinstance(schema, list):
            schema_fields = schema
        else:
            schema_fields = schema.model_fields.keys()

        column_list = []
        for column_name in schema_fields:
            if hasattr(model, column_name):
                column_list.append(getattr(model, column_name))

    return column_list
