import { site } from "../data/site";

export function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-inner">
        <p className="footer-credit">
          Designed + coded with care by {site.name}
        </p>
        <nav className="footer-links" aria-label="Social">
          {site.social.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
