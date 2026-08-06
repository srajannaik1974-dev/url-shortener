import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', href = '/', showText = true, className = '' }) {
  const iconSizes = {
    sm: 'h-5',
    md: 'h-6',
    lg: 'h-8',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-2 select-none font-['Plus_Jakarta_Sans'] ${className}`}>
      {/* Sleek slash logo mark inspired by BL.INK */}
      <div className="flex items-center tracking-tighter text-[#10B981] font-black text-xl leading-none">
        <span className="opacity-60">//</span>
      </div>
      {showText && (
        <span className={`font-extrabold tracking-wider text-[#F8FAFA] uppercase ${textSizes[size] || textSizes.md}`}>
          SNIP<span className="text-[#10B981]">.LY</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded px-1 py-0.5">
        {content}
      </Link>
    );
  }

  return content;
}
