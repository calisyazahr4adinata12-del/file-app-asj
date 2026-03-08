const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Client } = require("pg");
const Minio = require("minio");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API OK");
});

const upload = multer({ storage: multer.memoryStorage() });

/* ===============================
   PostgreSQL Connection
================================= */
const db = new Client({
  user: "postgres",
  host: "postgres", // ini nama service di docker-compose
  database: "filedb",
  password: "postgres",
  port: 5432,
});

db.connect()
  .then(() => console.log("PostgreSQL Connected"))
  .catch(err => console.error("DB Error:", err));

db.query(`
  CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    filename TEXT,
    url TEXT
  )
`);

/* ===============================
   MinIO Connection
================================= */
const minioClient = new Minio.Client({
  endPoint: "minio", // nama service docker
  port: 9000,
  useSSL: false,
  accessKey: "minio",
  secretKey: "minio123",
});

const bucket = "uploads";

minioClient.bucketExists(bucket, function (err, exists) {
  if (!exists) {
    minioClient.makeBucket(bucket, function (err) {
      if (err) console.log(err);
      else console.log("Bucket created!");
    });
  }
});

/* ===============================
   API ROUTES
================================= */

// Upload File
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    await minioClient.putObject(bucket, file.originalname, file.buffer);

    const url = `http://172.20.10.3:9000/${bucket}/${file.originalname}`;

    await db.query(
      "INSERT INTO files (filename, url) VALUES ($1, $2)",
      [file.originalname, url]
    );

    res.json({ message: "File uploaded successfully 💗" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get All Files
app.get("/files", async (req, res) => {
  const result = await db.query("SELECT * FROM files");
  res.json(result.rows);
});

// Delete File
app.delete("/files/:id", async (req, res) => {
  const id = req.params.id;

  await db.query("DELETE FROM files WHERE id=$1", [id]);

  res.json({ message: "File deleted 💔" });
});

/* ===============================
   Start Server
================================= */
app.listen(5000, () => {
  console.log("Backend running on port 5000 💗");
});
