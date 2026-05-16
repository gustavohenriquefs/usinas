FROM python:3.12-slim

WORKDIR /app

# Instalar dependências necessárias do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro para aproveitar o cache do Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o resto do código da aplicação
COPY . .

# Expor a porta que o Uvicorn vai rodar
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000"]
