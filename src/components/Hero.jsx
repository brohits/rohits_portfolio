import { site } from "../data/site";
import { AdaptiveSection } from "./AdaptiveSection";
import { GradientOrbs } from "./GradientOrbs";

export function Hero() {
  const { hero } = site;

  return (
    <AdaptiveSection
      className="hero"
      aria-labelledby="hero-heading"
      probeSelectors={[".adaptive-probe"]}
    >
      <GradientOrbs className="gradient-orbs--hero" />
      <div className="hero-copy">
        <h1 id="hero-heading" className="hero-title adaptive-probe">
          {hero.headline} <em>{hero.emphasis}</em> {hero.headlineEnd}
        </h1>
        <p className="hero-lede adaptive-probe">{hero.lede}</p>
      </div>
    </AdaptiveSection>
  );
}
