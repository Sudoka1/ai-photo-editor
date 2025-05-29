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

    const formData = new FormData();
    formData.append("image_file", image);
    formData.append("size", "auto");

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": "TWfXCcCNkidr3KBucReGSu87", // Replace with your actual API key
          },
          responseType: "blob",
        }
      );

      const resultImage = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(resultImage);
      setResultUrl(imageUrl);
    } catch (err) {
      alert("Image upload failed!\n" + (err.response?.data?.errors?.[0]?.title || err.message));
      console.error("Upload error:", err.response?.data || err);
    }

    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "edited-photo.png";
    link.click();
  };

  return (
    <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial" }}>
      <h1>AI Photo Editor</h1>

      <input type="file" accept="image/*" onChange={handleUpload} />
      <br />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: "10px", padding: "8px 20px", cursor: "pointer" }}
      >
        {loading ? "Processing..." : "Apply AI"}
      </button>

      <div style={{ marginTop: "30px" }}>
        {image && (
          <>
            <h3>Original Image:</h3>
            <img src={URL.createObjectURL(image)} alt="Original" width="250" />
          </>
        )}

        {resultUrl && (
          <>
            <h3>Result Image:</h3>
            <img src={resultUrl} alt="Result" width="250" />
            <br />
            <button
              onClick={handleDownload}
              style={{ marginTop: "10px", padding: "8px 20px", cursor: "pointer" }}
            >
              Download Result
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
