import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Upload, FileText, Download, Eye, Trash2, PlusCircle } from "lucide-react";
import "./Files.css";

export default function ChildFiles() {
  const { childId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

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

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.id;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("child_id", childId);
    formData.append("uploaded_by", userId);

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
      setShowForm(false);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
      alert("File deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="files-container">
      <div className="files-header">
        <h2 className="files-title">
          <FileText className="icon-blue" /> Files for Child {childId}
        </h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          <PlusCircle /> {showForm ? "Cancel" : "Add File"}
        </button>
      </div>

      {showForm && (
        <form className="upload-form" onSubmit={handleUpload}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="input-file"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-text"
          />
          <button type="submit" disabled={uploading} className="btn-upload">
            <Upload /> {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}

      {files.length === 0 ? (
        <p className="no-files">No files found.</p>
      ) : (
        <div className="files-grid">
          {files.map((f) => {
            const uploadDate = new Date(f.upload_date);
            const fileUrl = `http://localhost:3000${f.file_path}`;
            return (
              <div key={f.id} className="file-card">
                <div className="file-header">
                  <FileText className="icon-blue" /> {f.description}
                </div>
                <p className="file-date">
                  Uploaded on: {uploadDate.toLocaleString("en-GB", { hour12: false })}
                </p>
                <div className="file-actions">
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <Eye /> View
                  </a>
                  <a href={fileUrl} download>
                    <Download /> Download
                  </a>
                  <button onClick={() => handleDelete(f.id)}>
                    <Trash2 /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
