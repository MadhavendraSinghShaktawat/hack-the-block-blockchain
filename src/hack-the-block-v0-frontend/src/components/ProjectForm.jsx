import React, { useState } from 'react';
import { createProject } from '../services/projectService';
import './ProjectForm.css';

/**
 * Project creation form component
 * @param {Object} props Component properties
 * @param {Function} props.onSuccess Callback when project creation is successful
 * @param {Function} props.onCancel Callback when form is canceled
 */
const ProjectForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isMockMode, setIsMockMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const result = await createProject(formData);
      setIsMockMode(result.isMock);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result.projectId, result.isMock);
        }
      } else {
        setSubmitError(result.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="project-form-container">
      <div className="project-form-header">
        <h2>Create New Project</h2>
        <p className="form-description">
          Create a project to collaborate with others in the ecosystem.
        </p>
      </div>
      
      {isMockMode && (
        <div className="mock-mode-indicator">
          Running in development mode with mock data
        </div>
      )}
      
      {submitError && (
        <div className="form-error-message">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">Project Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter a clear, descriptive title"
            className={errors.title ? 'input-error' : ''}
          />
          {errors.title && <div className="error-text">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Describe your project in detail"
            rows={5}
            className={errors.description ? 'input-error' : ''}
          />
          {errors.description && <div className="error-text">{errors.description}</div>}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm; 