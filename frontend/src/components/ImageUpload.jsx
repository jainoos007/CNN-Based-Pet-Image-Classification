import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPrediction(""); // Reset previous prediction
      setError(""); // Clear previous errors
      setImagePreview(URL.createObjectURL(file)); // Preview selected image
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("⚠️ Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setError(""); // Clear previous errors
    setPrediction(""); // Reset previous result

    try {
      const response = await axios.post(
        "http://localhost:7000/upload",
        formData
      );
      setPrediction(response.data.result);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("❌ Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-400">
        Cat vs Dog Classifier 🐱🐶
      </h1>

      <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center w-96">
        <label className="block border-2 border-dashed border-gray-500 rounded-lg p-6 cursor-pointer hover:bg-gray-600 transition duration-300">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <span className="text-lg font-medium text-gray-300">
            {image ? "📸 Image Selected" : "📂 Click to Upload"}
          </span>
        </label>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Selected Preview"
            className="w-full h-52 object-cover mt-4 rounded-lg shadow-md border border-gray-500"
          />
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-6 w-full py-2 rounded-lg text-lg font-bold transition duration-300 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "🔄 Predicting..." : "🚀 Upload & Predict"}
        </button>

        {error && <p className="mt-4 text-red-400 font-semibold">{error}</p>}
        {prediction && (
          <p className="mt-4 text-lg font-bold text-green-400">
            ✅ Prediction: {prediction}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
