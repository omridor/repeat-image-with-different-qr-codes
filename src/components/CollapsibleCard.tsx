import { useState } from 'react';
import './CollapsibleCard.css';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: string;
}

export function CollapsibleCard({ title, children, defaultExpanded = false, icon }: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="collapsible-card">
      <button
        className="collapsible-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="collapsible-card-title">
          {icon && <span className="collapsible-card-icon">{icon}</span>}
          <h2>{title}</h2>
        </div>
        <span className={`collapsible-card-chevron ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </button>
      
      {isExpanded && (
        <div className="collapsible-card-content">
          {children}
        </div>
      )}
    </div>
  );
}
