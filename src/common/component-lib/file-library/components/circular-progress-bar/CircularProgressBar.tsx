import { useEffect, useState } from 'react';

const CircularProgressBar = ({ percentage }: { percentage: number }): JSX.Element => {
  const [offset, setOffset] = useState(100);

  const circumference = 2 * Math.PI * 18;

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    setOffset(progressOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  return (
    <svg width="100" height="100">
      <circle
        cx="50"
        cy="50"
        r="18"
        stroke="rgb(var(--marvin-divider-1))"
        strokeWidth="6"
        fill="transparent"
      />
      {percentage > 0 ? (
        <circle
          cx="50"
          cy="50"
          r="18"
          stroke="rgb(var(--marvin-primary))"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 850ms ease-in-out' }}
        />
      ) : null}
    </svg>
  );
};

export default CircularProgressBar;
