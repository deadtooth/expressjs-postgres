import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
var cors = require('cors');

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`Hello, World! The time from the DB is ${rows[0].now}`);
});

app.get("/events", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM events ORDER BY id");
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(rows))
});

app.get("/event/:id", async (req, res) => {
  const eventId = req.params.id;
  const { rows } = await pool.query(`SELECT * FROM events WHERE id = ${eventId}`);
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(rows))
});

app.get("/performers", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM performers ORDER BY id");
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(rows))
});

app.get("/ticket_suppliers", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM ticket_suppliers ORDER BY id");
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(rows))
});

app.get("/lineup/:id", async (req, res) => {
  const eventId = req.params.id;
  const { rows } = await pool.query(`SELECT * FROM performers WHERE event_id = ${eventId} AND published = 1 ORDER BY id`);
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(rows))
});

app.get("/tickets/:id", async (req, res) => {
  const eventId = req.params.id;
  const { rows } = await pool.query(`SELECT * FROM ticket_suppliers WHERE event_id = ${eventId} AND published = 1 ORDER BY id`);
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(rows))
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
