# nanamimami-comm

A minimal WebSocket chat server and web client for interacting with an LLM (Large Language Model) backend, designed for debugging and rapid prototyping.

## Features

- **WebSocket API**: Real-time chat between users and the LLM backend.
- **Simple Web UI**: Terminal-like chat interface for easy testing.
- **Dockerized**: Ready for local or containerized development.
- **Configurable**: Easily set LLM backend host and port via environment variables.

## How It Works

- The Node.js server exposes a WebSocket endpoint.
- The web client (`public/index.html`) connects to the server and allows users to send messages.
- Each user message is sent to the LLM backend (configurable via `LLAMA_HOST` and `LLAMA_PORT`).
- The LLM's response is relayed back to the web client in real time.

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) (optional, for containerized usage)
- An LLM backend compatible with the `/completion` endpoint (e.g., Llama.cpp server)

### Running Locally

1. **Install dependencies:**
	```bash
	npm install
	```

2. **Start the server:**
	```bash
	npm start
	```
	The server will run on port `3001` by default.

3. **Open the web client:**
	- Visit [http://localhost:3001](http://localhost:3001) in your browser.

### Using Docker

You can build and run the project using Docker:

```bash
./run.sh
```

Or with Docker Compose (for hot-reload in development):

```bash
docker-compose up --build
```

### Environment Variables

- `PORT`: Port for the WebSocket server (default: `3001`)
- `LLAMA_HOST`: Hostname of the LLM backend (default: `localhost`)
- `LLAMA_PORT`: Port of the LLM backend (default: `11435`)

## File Structure

```
.
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── public/
│   └── index.html      # Web client
├── run.sh              # Helper script for Docker
├── server.js           # Main Node.js WebSocket server
└── README.md
```

## Example LLM Backend

This project expects an LLM backend with a `/completion` HTTP POST endpoint, such as [Llama.cpp server](https://github.com/ggerganov/llama.cpp/tree/master/examples/server).

## License

MIT