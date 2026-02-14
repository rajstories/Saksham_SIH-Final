export const NDMALogo = ({ size = 48 }: { size?: number }) => {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background circle with navy blue */}
        <circle cx="60" cy="60" r="58" fill="#002147" />
        
        {/* Outer ring with saffron accent */}
        <circle cx="60" cy="60" r="55" fill="none" stroke="#FF9933" strokeWidth="2" />
        
        {/* Ashoka Chakra - 24-spoke wheel in center */}
        <g transform="translate(60, 60)">
          {/* Outer ring of chakra */}
          <circle cx="0" cy="0" r="20" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          
          {/* 24 spokes */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <line
                key={i}
                x1="0"
                y1="-15"
                x2="0"
                y2="-22"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${angle})`}
              />
            );
          })}
          
          {/* Center circle */}
          <circle cx="0" cy="0" r="12" fill="#FF9933" />
          <circle cx="0" cy="0" r="8" fill="#FFFFFF" />
          <circle cx="0" cy="0" r="4" fill="#002147" />
        </g>
        
        {/* NDMA text at bottom */}
        <text
          x="60"
          y="95"
          fontSize="16"
          fontWeight="700"
          fill="#FFFFFF"
          textAnchor="middle"
          fontFamily="'Inter', 'Arial', sans-serif"
          letterSpacing="2"
        >
          NDMA
        </text>
        
        {/* Small decorative elements - stars or dots */}
        <circle cx="30" cy="30" r="2" fill="#FF9933" />
        <circle cx="90" cy="30" r="2" fill="#FF9933" />
        <circle cx="30" cy="90" r="2" fill="#FF9933" />
        <circle cx="90" cy="90" r="2" fill="#FF9933" />
      </svg>
    </div>
  );
};
