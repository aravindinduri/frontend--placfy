import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLoader, FiPlus, FiX } from 'react-icons/fi';

const TaskUpdateModal = ({ task, onClose, onSave, isAddingUpdate }) => {
  const [updateText, setUpdateText] = useState('');
  const [updateAttachments, setUpdateAttachments] = useState([]);

  const handleUpdateFileChange = (e) => {
    setUpdateAttachments(Array.from(e.target.files));
  };

  const handleRemoveUpdateAttachment = (index) => {
    setUpdateAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveUpdate = () => {
    onSave(task._id, updateText, updateAttachments);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add Update to "{task.name}"</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Text</label>
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Type your update here..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
            <input
              type="file"
              multiple
              onChange={handleUpdateFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {updateAttachments.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">New Attachments to Upload:</p>
                <ul className="list-disc list-inside text-gray-600">
                  {updateAttachments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <span>{file.name}</span>
                      <button 
                        onClick={() => handleRemoveUpdateAttachment(index)} 
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={handleSaveUpdate}
            disabled={isAddingUpdate || (!updateText.trim() && updateAttachments.length === 0)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2"
          >
            {isAddingUpdate ? <FiLoader className="animate-spin" /> : <FiPlus />} Add Update
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskUpdateModal;
