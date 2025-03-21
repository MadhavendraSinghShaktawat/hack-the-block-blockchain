import React from 'react';
import ProjectForm from './ProjectForm';
import './ProjectModal.css';

/**
 * Modal component for project creation
 * @param {Object} props Component properties
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {Function} props.onClose Callback when modal is closed
 * @param {Function} props.onProjectCreated Callback when a project is successfully created
 */
const ProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  if (!isOpen) return null;
  
  const handleSuccess = (projectId, isMock) => {
    if (onProjectCreated) {
      onProjectCreated(projectId, isMock);
    }
    onClose();
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <ProjectForm 
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default ProjectModal; 