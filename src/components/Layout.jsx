import { BackgroundShapes } from "./BackgroundShapes";
import { CustomCursor } from "./CustomCursor";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ children, skipTo = "#work" }) {
  return (
    <>
      <BackgroundShapes />
      <div className="site-content">
        <CustomCursor />
        <a className="skip-link" href={skipTo}>
          Skip to content
        </a>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
