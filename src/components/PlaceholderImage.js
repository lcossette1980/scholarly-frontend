import { ImageIcon } from 'lucide-react';

const PlaceholderImage = ({
  label,
  prompt = '',
  aspectRatio = '16/9',
  gradient = 'from-primary-100 to-accent-100',
  className = ''
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center overflow-hidden relative group ${className}`}
      style={{ aspectRatio }}
      title={prompt}
      data-ai-prompt={prompt}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 blur-xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/15 blur-lg" />
      </div>

      <div className="text-center p-6 relative z-10">
        <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
          <ImageIcon className="w-7 h-7 text-primary-700/60" />
        </div>
        <p className="text-sm font-medium text-primary-800/70 max-w-[200px]">{label}</p>
      </div>
    </div>
  );
};

export default PlaceholderImage;
