import { Icon } from "../ui/Icon";

/** Self-contained BEE emblem — avoids any external image dependency. */
export function Emblem({ size = 48, invert = false }: { size?: number; invert?: boolean }) {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: invert ? "rgba(255,255,255,0.12)" : "#E7EFFB",
        border: invert ? "1px solid rgba(255,255,255,0.35)" : "1px solid #c9d9f7",
      }}
    >
      <Icon
        name="eco"
        size={Math.round(size * 0.56)}
        fill
        className={invert ? "text-on-primary" : "text-primary"}
      />
    </div>
  );
}
