export function BlogPostContent({ body }) {
  const elements = [];
  let listItems = [];
  let listKey = 0;

  const flushList = () => {
    if (!listItems.length) return;
    elements.push(
      <ul key={`list-${listKey++}`} className="blog-post-list">
        {listItems}
      </ul>
    );
    listItems = [];
  };

  body.forEach((block, index) => {
    if (block.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={index} className="blog-post-subheading">
          {block.slice(3)}
        </h2>
      );
      return;
    }

    if (block.startsWith("# ")) {
      flushList();
      elements.push(
        <h2 key={index} className="blog-post-heading">
          {block.slice(2)}
        </h2>
      );
      return;
    }

    if (block.startsWith("* ")) {
      listItems.push(<li key={`item-${index}`}>{block.slice(2)}</li>);
      return;
    }

    flushList();
    elements.push(
      <p key={index} className="blog-post-paragraph">
        {block}
      </p>
    );
  });

  flushList();

  return <div className="blog-post-content">{elements}</div>;
}
