import { WebSocketServer } from 'ws';
import { createServer, request } from 'http';
import { readFile } from 'fs/promises';
import { parse } from 'url';

const PORT = process.env.PORT || 3001;
const llamaHost = process.env.LLAMA_HOST || 'localhost';
const llamaPort = process.env.LLAMA_PORT || 11435;
const llamaPath = '/completion';

const server = createServer(async (req, res) => {
  console.log(`HTTP request recebida: ${req.method} ${req.url}`);
  const parsed = parse(req.url, true);

  if (parsed.pathname === '/') {
    const html = await readFile('./public/index.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  let context = [];

  ws.on('message', (msg) => {

    const userMsg = msg.toString();
    context.push({ role: 'Usuário', content: userMsg });

    const prompt = context.map(m => `${m.role}: ${m.content}`).join('\n') + '\nKalika:';

    const postData = JSON.stringify({
      prompt,
      temperature: 0.7,
      stop: ['Usuário:', 'Kalika:']
    });

    const options = {
      hostname: llamaHost,
      port: llamaPort,
      path: llamaPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const reqLlama = request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const reply = (parsed.completion || parsed.content || '[vazio]').trim();

          context.push({ role: 'Kalika', content: reply });
          ws.send(reply);
        } catch (err) {
          console.error("parser error:", err);
          ws.send('[ERRO] Resposta inválida do modelo.');
        }
      });
    });

    reqLlama.on('error', (e) => {
      console.error("error at connection:", e.message);
      ws.send('[ERRO] Falha ao conectar com o modelo.');
    });

    reqLlama.write(postData);
    reqLlama.end();
  });

  ws.on('close', () => console.log("ws closed"));
  ws.on('error', (err) => console.error("error on ws:", err));
});

server.listen(PORT, () => {
  console.log(`ws running at port ${PORT}`);
});
