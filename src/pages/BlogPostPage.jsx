import { Link, Navigate, useParams } from "react-router-dom";
import { BlogPostContent } from "../components/BlogPostContent";
import { Layout } from "../components/Layout";
import { getBlogBySlug } from "../data/blogs";

export function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogBySlug(slug);

  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <Layout skipTo="#article">
      <article id="article" className="blog-post" aria-labelledby="post-title">
        <div className="blog-post-inner">
          <Link to="/blogs" className="blog-back">
            ← All posts
          </Link>

          <header className="blog-post-header">
            <div className="blog-post-meta">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <h1 id="post-title" className="blog-post-title">
              {post.title}
            </h1>
            <p className="blog-post-tags">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </p>
          </header>

          <BlogPostContent body={post.body} />
        </div>
      </article>
    </Layout>
  );
}
