import { useRef } from "react";
import { useAdaptiveContrast } from "../hooks/useAdaptiveContrast";

export function AdaptiveSection({
  as: Component = "section",
  className = "",
  probeSelectors = [".adaptive-probe"],
  children,
  ...props
}) {
  const ref = useRef(null);
  useAdaptiveContrast(ref, { probeSelectors });

  return (
    <Component
      ref={ref}
      className={`adaptive-section${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </Component>
  );
}
