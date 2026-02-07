import { useState } from 'react';
import { uploadAttachment } from '../../api/tasks';

function UploadAttachment({ workspaceSlug, taskId, onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const attachment = await uploadAttachment(workspaceSlug, taskId, file);
      onUpload(attachment); // Signal parent to re-fetch task details
      setFile(null);
      alert('Attachment uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full text-sm border rounded-lg p-2"
      />
      <button 
        type="submit" 
        disabled={!file || uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}

export default UploadAttachment;