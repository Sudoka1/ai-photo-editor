import React, { useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function App() {
  const [image, setImage] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const resultRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

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
            "X-Api-Key": "TWfXCcCNkidr3KBucReGSu87",
          },
          responseType: "blob",
        }
      );
      const resultImage = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(resultImage);
      setResultUrl(imageUrl);
    } catch (err) {
      alert("Image upload failed!\\n" + (err.response?.data?.errors?.[0]?.title || err.message));
    }

    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "edited-photo.png";
    link.click();
  };

  const handleSavePDF = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("edited-photo.pdf");
  };

  return (
    <div style={{ textAlign: "center", padding: 40, fontFamily: "Arial" }}>
      <h1>AI Photo Editor</h1>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #888",
          padding: 20,
          margin: "10px auto",
          width: 300,
          borderRadius: 8,
          backgroundColor: "#f8f8f8",
        }}
      >
        <p>Drag & drop image here</p>
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: 10, padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Processing..." : "Apply AI"}
      </button>

      <div style={{ marginTop: 30 }}>
        {image && (
          <>
            <h3>Original Image:</h3>
            <img src={URL.createObjectURL(image)} alt="Original" width="250" />
          </>
        )}

        {resultUrl && (
          <div ref={resultRef}>
            <h3>Result Image:</h3>
            <div style={{ backgroundColor: bgColor, padding: 20, display: "inline-block" }}>
              <img src={resultUrl} alt="Result" width="250" />
            </div>
            <br />
            <label>
              Background Color:{" "}
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </label>
            <br />
            <button onClick={handleDownload} style={{ marginTop: 10, marginRight: 10 }}>
              Download PNG
            </button>
            <button onClick={handleSavePDF} style={{ marginTop: 10 }}>
              Save as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
