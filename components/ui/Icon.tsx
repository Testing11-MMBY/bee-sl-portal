import { CSSProperties } from "react";

export function Icon({
  name,
  className = "",
  size = 20,
  fill = false,
  style,
}: {
  name: string;
  className?: string;
  size?: number;
  fill?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0",
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
