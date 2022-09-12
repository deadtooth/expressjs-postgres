import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 3333;

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

app.get("/events/:id", async (req, res) => {
  const eventId = req.params.id;
  const { rows } = await pool.query(`SELECT * FROM events WHERE event_id = ${eventId}`);
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
  const { rows } = await pool.query(`SELECT * FROM performers WHERE event_id = ${eventId} ORDER BY id`);
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(rows))
});

app.get("/tickets/:id", async (req, res) => {
  const eventId = req.params.id;
  const { rows } = await pool.query(`SELECT * FROM ticket_suppliers WHERE event_id = ${eventId} ORDER BY id`);
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(rows))
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
