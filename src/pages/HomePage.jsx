import { About } from "../components/About";
import { Hero } from "../components/Hero";
import { Layout } from "../components/Layout";
import { RecentRoles } from "../components/RecentRoles";
import { Work } from "../components/Work";

export function HomePage() {
  return (
    <Layout skipTo="#work">
      <Hero />
      <Work />
      <RecentRoles />
      <About />
    </Layout>
  );
}
