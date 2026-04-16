import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, BarChart3, Target } from 'lucide-react';

const iconMap = {
  FileText,
  BarChart3,
  Target,
};

const SampleProjectCard = ({ title, description, sourceCount, outputDesc, sampleKey, icon }) => {
  const navigate = useNavigate();
  const Icon = iconMap[icon] || FileText;

  return (
    <div className="border border-[#e5e7eb] rounded-lg p-5 bg-white hover:shadow-card-hover transition-all">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-secondary-900">{title}</h4>
          <p className="text-xs text-secondary-500">{sourceCount} sources &rarr; {outputDesc}</p>
        </div>
      </div>
      <p className="text-sm text-secondary-600 mb-4">{description}</p>
      <button
        onClick={() => navigate(`/content/generate?sample=${sampleKey}`)}
        className="btn btn-secondary w-full text-sm"
      >
        Try This Sample &rarr;
      </button>
    </div>
  );
};

export default SampleProjectCard;
