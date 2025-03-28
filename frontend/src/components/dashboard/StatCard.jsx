import React from "react";
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'primary-gradient' 
}) => {
  return (
    <div className={`stats-card stats-card-${variant}`}>
      <div className="stats-card-icon">
        <Icon />
      </div>
      <div className="stats-card-value">{value}</div>
      <div className="stats-card-title">{title}</div>
    </div>
  );
};

export default StatCard;
