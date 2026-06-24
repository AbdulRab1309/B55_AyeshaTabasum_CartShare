import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;
const dbPath = new URL('./db.json', import.meta.url);

app.use(cors());
app.use(express.json());

async function readDb() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

app.get('/api/rooms/:roomCode', async (req, res) => {
  const roomCode = req.params.roomCode.toUpperCase();
  const db = await readDb();
  const room = db.rooms.find((r) => r.roomCode === roomCode);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

app.post('/api/rooms', async (req, res) => {
  const { roomCode } = req.body;
  if (!roomCode) {
    return res.status(400).json({ error: 'roomCode is required' });
  }

  const db = await readDb();
  if (db.rooms.some((r) => r.roomCode === roomCode.toUpperCase())) {
    return res.status(409).json({ error: 'Room already exists' });
  }

  const newRoom = {
    roomCode: roomCode.toUpperCase(),
    participants: [],
    items: [],
    activityLog: []
  };

  db.rooms.push(newRoom);
  await writeDb(db);
  res.status(201).json(newRoom);
});

app.put('/api/rooms/:roomCode', async (req, res) => {
  const roomCode = req.params.roomCode.toUpperCase();
  const payload = req.body;

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Invalid room payload' });
  }

  const db = await readDb();
  const roomIndex = db.rooms.findIndex((r) => r.roomCode === roomCode);
  if (roomIndex === -1) {
    return res.status(404).json({ error: 'Room not found' });
  }

  db.rooms[roomIndex] = {
    ...db.rooms[roomIndex],
    ...payload,
    roomCode
  };

  await writeDb(db);
  res.json(db.rooms[roomIndex]);
});

app.delete('/api/rooms/:roomCode', async (req, res) => {
  const roomCode = req.params.roomCode.toUpperCase();
  const db = await readDb();
  const roomIndex = db.rooms.findIndex((r) => r.roomCode === roomCode);
  if (roomIndex === -1) {
    return res.status(404).json({ error: 'Room not found' });
  }

  db.rooms.splice(roomIndex, 1);
  await writeDb(db);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`CartShare server listening on http://localhost:${PORT}`);
});
