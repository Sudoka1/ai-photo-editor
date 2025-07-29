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
      alert(
        "Image upload failed!\n" +
          (err.response?.data?.errors?.[0]?.title || err.message)
      );
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
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", color: "#333" }}>AI Photo Editor</h1>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "3px dashed #aaa",
          borderRadius: 12,
          padding: 30,
          backgroundColor: "#fff",
          width: 320,
          marginBottom: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ marginBottom: 10 }}>Drag & drop image here</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: "block", margin: "0 auto" }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: "#6200ea",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {loading ? "Processing..." : "Apply AI"}
      </button>

      <div style={{ marginTop: 40 }}>
        {image && (
          <>
            <h3>Original Image:</h3>
            <img
              src={URL.createObjectURL(image)}
              alt="Original"
              width="250"
              style={{ borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
            />
          </>
        )}

        {resultUrl && (
          <div ref={resultRef} style={{ marginTop: 30 }}>
            <h3>Result Image:</h3>
            <div
              style={{
                backgroundColor: bgColor,
                padding: 20,
                display: "inline-block",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <img src={resultUrl} alt="Result" width="250" />
            </div>
            <br />
            <label style={{ display: "block", marginTop: 15 }}>
              Background Color:{" "}
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                style={{ marginLeft: 10 }}
              />
            </label>
            <br />
            <button
              onClick={handleDownload}
              style={{
                marginTop: 20,
                marginRight: 10,
                backgroundColor: "#2196f3",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Download PNG
            </button>
            <button
              onClick={handleSavePDF}
              style={{
                marginTop: 20,
                backgroundColor: "#4caf50",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Save as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
