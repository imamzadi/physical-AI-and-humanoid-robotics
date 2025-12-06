import React from 'react';
import clsx from 'clsx';
import styles from './HardwareSetupCard.module.css';

interface HardwareSetupCardProps {
  title: string;
  description: string;
  requirements: string[];
  platform: 'workstation' | 'edge' | 'both';
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

const complexityColors = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
};

export default function HardwareSetupCard({
  title,
  description,
  requirements,
  platform,
  complexity,
}: HardwareSetupCardProps): JSX.Element {
  const platformIcon = platform === 'workstation' ? '🖥️' : platform === 'edge' ? '🤖' : '🔄';

  return (
    <div className={clsx('card', styles.hardwareCard)}>
      <div className="card__header">
        <div className={styles.platformIcon}>{platformIcon}</div>
        <h3>{title}</h3>
      </div>
      <div className="card__body">
        <p>{description}</p>
        <div className={styles.requirementsSection}>
          <h4>Required Components:</h4>
          <ul>
            {requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card__footer">
        <span className={`badge badge--${complexityColors[complexity]}`}>
          {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
        </span>
      </div>
    </div>
  );
}