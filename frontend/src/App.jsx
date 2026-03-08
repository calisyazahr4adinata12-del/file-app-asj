import { useState } from "react";
import confetti from "canvas-confetti";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [titleFile, setTitleFile] = useState("");

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file dulu ya 💗");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("title", titleFile);

    try {
      const res = await fetch("http://172.20.10.3:5000/upload", {
        method: "POST",
        body: formData,
      });

      await res.json();

      fireConfetti();
      alert("Upload berhasil ✨💖");
    } catch (err) {
      console.error(err);
      alert("Upload gagal 😢");
    }
  };

  return (
    <div className="container">

      {/* shooting stars */}
      <div className="stars">
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* sparkle */}
      <div className="sparkle s1"></div>
      <div className="sparkle s2"></div>
      <div className="sparkle s3"></div>

      {/* ribbon */}
      <div className="ribbon r1"></div>
      <div className="ribbon r2"></div>

      <div className="card">
        <h1 className="title">💖 upload file disini yaww 💖</h1>

        <input
          type="text"
          placeholder="Nama"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Judul File"
          onChange={(e) => setTitleFile(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>
          Upload 💗
        </button>
      </div>

      {/* CAT WALK */}
      <div className="cat-walk">
        <img
          src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
          alt="cute cat"
        />
      </div>

      {/* PAW TRAIL */}
      <div className="paw-trail">
        <span>🐾</span>
        <span>🐾</span>
        <span>🐾</span>
        <span>🐾</span>
        <span>🐾</span>
      </div>

    </div>
  );
}
