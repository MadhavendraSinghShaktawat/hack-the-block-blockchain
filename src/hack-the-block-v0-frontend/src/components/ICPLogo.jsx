import React from 'react';

/**
 * SVG icon component for the Internet Computer Protocol logo
 * @returns {JSX.Element} ICP logo component
 */
function ICPLogo() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="icp-logo"
    >
      <path 
        d="M40 0C17.909 0 0 17.909 0 40C0 62.091 17.909 80 40 80C62.091 80 80 62.091 80 40C80 17.909 62.091 0 40 0ZM40 72C22.327 72 8 57.673 8 40C8 22.327 22.327 8 40 8C57.673 8 72 22.327 72 40C72 57.673 57.673 72 40 72Z" 
        fill="currentColor" 
      />
      <path 
        d="M40 16C26.745 16 16 26.745 16 40C16 53.255 26.745 64 40 64C53.255 64 64 53.255 64 40C64 26.745 53.255 16 40 16ZM40 56C31.163 56 24 48.837 24 40C24 31.163 31.163 24 40 24C48.837 24 56 31.163 56 40C56 48.837 48.837 56 40 56Z" 
        fill="currentColor" 
      />
      <circle cx="40" cy="40" r="8" fill="currentColor" />
    </svg>
  );
}

export default ICPLogo; 