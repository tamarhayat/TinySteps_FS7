import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Files.css";

export default function ChildFiles() {
  const { childId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/files/child/${childId}`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [childId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("child_id", childId);
    formData.append("uploaded_by", "300000010"); // לדוגמה, אפשר להחליף ביוזר הנוכחי

    setUploading(true);
    try {
      const res = await fetch("http://localhost:3000/api/files", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("File uploaded successfully");
      setFile(null);
      setDescription("");
      fetchFiles(); 
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="files-container">
      <h2>Files for Child {childId}</h2>

      {/* Upload Form */}
      <form className="upload-form" onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <div className="files-grid">
          {files.map((f) => {
            const uploadDate = new Date(f.upload_date);
            return (
              <div key={f.id} className="file-card">
                <h3>{f.description}</h3>
                <p>
                  <strong>Uploaded on:</strong>{" "}
                  {uploadDate.toLocaleString("en-GB", { hour12: false })}
                </p>
                {f.file_path && (
                  <a href={f.file_path} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
