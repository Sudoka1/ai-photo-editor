import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

 const handleSubmit = async () => {
  if (!image) return;
  setLoading(true);

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Xenova/colorize",
      image,
      {
        headers: {
          Authorization: "Bearer hf_ezRAuPZGlfHriuyKDEMOCKKEY123", // Можно заменить на свой токен
          "Content-Type": "application/octet-stream",
        },
        responseType: "blob",
      }
    );

    const imageBlob = new Blob([response.data], { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(imageBlob);
    setResultUrl(imageUrl);
  } catch (err) {
    alert("Ошибка при отправке изображения!");
    console.error(err);
  }

  setLoading(false);
};

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>AI Photo Editor</h1>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <br />
      <button onClick={handleSubmit} disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "Обработка..." : "Применить AI"}
      </button>
      <div style={{ marginTop: "30px" }}>
        {image && <img src={URL.createObjectURL(image)} alt="Original" width="200" />}
        {resultUrl && (
          <>
            <h3>Результат:</h3>
            <img src={resultUrl} alt="Result" width="200" />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
