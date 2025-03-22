import React, { useState } from 'react';
import { projectService, ProjectInput } from '../services/project-service';

interface CreateProjectProps {
  onProjectCreated: () => void;
}

/**
 * Component for creating a new project
 */
export const CreateProject: React.FC<CreateProjectProps> = ({ onProjectCreated }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission to create a new project
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!title.trim()) {
        throw new Error('Project title is required');
      }

      const projectInput: ProjectInput = {
        title: title.trim(),
        description: description.trim(),
      };

      // Create the project using the project service
      const success = await projectService.createProject(projectInput);
      
      if (success) {
        // Reset form fields
        setTitle('');
        setDescription('');
        
        // Notify parent component that a project was created
        onProjectCreated();
      } else {
        throw new Error('Failed to create project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-project">
      <h2>Create New Project</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            rows={4}
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}; 