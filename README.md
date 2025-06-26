# Movie RAG Chatbot

A movie recommendation chatbot using RAG (Retrieval-Augmented Generation) with DataStax Astra DB and OpenAI.

## Features

- Semantic movie search using vector embeddings
- IMDB movie database integration
- OpenAI-powered conversation
- DataStax Astra DB for vector storage

## Installation

```bash
npm install
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `OPENAI_API_KEY`
- `ASTRA_DB_APPLICATION_TOKEN`
- `ASTRA_DB_API_ENDPOINT`
