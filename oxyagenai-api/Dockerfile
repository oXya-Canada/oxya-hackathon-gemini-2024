FROM python:3.10-slim

ENV PYTHONUNBUFFERED True

ENV APP_HOME /app
ENV PORT 8080
WORKDIR /app
COPY . ./

RUN pip install --no-cache-dir -r requirements.txt

CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 1