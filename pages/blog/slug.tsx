import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTag } from '@fortawesome/free-solid-svg-icons';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';

interface BlogPostProps {
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
  };
  content: string;
}

export default function BlogPost({ frontmatter, content }: BlogPostProps) {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row">
        {/* 左侧边栏 */}
        <aside className="w-full md:w-1/4 mb-8 md:mb-0 md:pr-8">
          <div className="sticky top-8">
            <h1 className="text-3xl font-serif font-bold mb-4 text-amber-800 dark:text-amber-200">{frontmatter.title}</h1>
            <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
              <div className="flex items-center mb-s2">
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                <time dateTime={frontmatter.date}>{new Date(frontmatter.date).toLocaleDateString()}</time>
              </div>
              <div className="flex items-center flex-wrap">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                {frontmatter.tags.map((tag, i) => (
                  <span key={i} className="mr-2 mb-1 bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded-full text-xs text-amber-800 dark:text-amber-100">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 右侧主内容 */}
        <main className="w-full md:w-3/4">
          <article className="prose dark:prose-invert prose-amber prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 text-amber-800 dark:text-amber-200" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-amber-700 dark:text-amber-300" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-amber-600 dark:text-amber-400" {...props} />,
                p: ({node, ...props}) => <p className="my-4 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-outside my-4 pl-6" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-outside my-4 pl-6" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-amber-500 pl-4 italic my-4 text-amber-700 dark:text-amber-300" {...props} />
                ),
                code: ({node, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <pre className="bg-amber-50 dark:bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-amber-100 dark:bg-amber-900 rounded-md px-1.5 py-0.5 text-amber-800 dark:text-amber-100" {...props}>
                      {children}
                    </code>
                  );
                },
                img: ({node, ...props}) => <img className="mx-auto my-6 rounded-lg shadow-md" {...props} />,
                a: ({node, ...props}) => <a className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 underline" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map((filename) => ({
    params: { slug: filename.replace('.md', '') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    props: {
      frontmatter: {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString() : new Date(data.date).toISOString(),
      },
      content,
    },
  };
};