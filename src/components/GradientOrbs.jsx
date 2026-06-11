export function GradientOrbs({ className = "" }) {
  return (
    <div
      className={`gradient-orbs${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <span className="gradient-orb gradient-orb--mesh" />
      <span className="gradient-orb gradient-orb--green" />
      <span className="gradient-orb gradient-orb--soft" />
      <span className="gradient-orb gradient-orb--mint" />
      <span className="gradient-orb gradient-orb--teal" />
      <span className="gradient-orb gradient-orb--blue" />
      <span className="gradient-orb gradient-orb--blue-deep" />
      <span className="gradient-orb gradient-orb--orange" />
      <span className="gradient-orb gradient-orb--amber" />
    </div>
  );
}
