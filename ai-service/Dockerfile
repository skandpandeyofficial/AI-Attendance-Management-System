FROM python:3.11

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libx11-6 \
    libsm6 \
    libxext6 \
    libxrender1 \
    build-essential

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}