import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { blogs } from "../data/blogs";

export function BlogsPage() {
  return (
    <Layout skipTo="#blog-list">
      <section className="blogs-page" aria-labelledby="blogs-heading">
        <GradientOrbs />
        <div className="blogs-page-inner">
          <header className="blogs-header">
            <p className="blogs-eyebrow">Writing</p>
            <h1 id="blogs-heading" className="blogs-title">
              Blog
            </h1>
            <p className="blogs-lede">
              Notes on design systems, research, prototyping, and shipping
              products that people actually use.
            </p>
          </header>

          <ol id="blog-list" className="blog-grid">
            {blogs.map((post, index) => (
              <li key={post.slug} className="blog-card">
                <Link to={`/blogs/${post.slug}`} className="blog-card-hitarea">
                  <span className="blog-card-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <p className="blog-card-tags">
                      {post.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </p>
                    <span className="blog-card-link">Read article →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Layout>
  );
}

function GradientOrbs() {
  return (
    <>
      <div className="blogs-glow blogs-glow--top" aria-hidden="true" />
      <div className="blogs-glow blogs-glow--bottom" aria-hidden="true" />
    </>
  );
}
