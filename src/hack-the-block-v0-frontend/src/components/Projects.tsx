import React, { useEffect, useState } from 'react';
import { Project, projectService } from '../services/project-service';
import { CreateProject } from './CreateProject';

/**
 * Component for displaying and managing projects
 */
export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch projects from the backend
   */
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const projectList = await projectService.getProjects();
      setProjects(projectList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  /**
   * Handler called after a project is successfully created
   */
  const handleProjectCreated = () => {
    fetchProjects();
  };

  return (
    <div className="projects-container">
      <h1>Projects</h1>
      
      <CreateProject onProjectCreated={handleProjectCreated} />
      
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <div className="projects-list">
          {projects.length === 0 ? (
            <p>No projects found. Create your first project above!</p>
          ) : (
            projects.map((project) => (
              <div key={Number(project.id)} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-meta">
                  <span>Created: {new Date(Number(project.created_at) / 1000000).toLocaleString()}</span>
                  <span>Creator: {project.creator.toString().slice(0, 10)}...</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}; 