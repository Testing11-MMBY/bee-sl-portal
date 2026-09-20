import { Icon } from "./Icon";

export function Stars({
  value,
  size = 16,
  className = "",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-label={`${value} star`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name="star"
          size={size}
          fill={i <= value}
          className={i <= value ? "text-star-active" : "text-outline"}
        />
      ))}
    </span>
  );
}
