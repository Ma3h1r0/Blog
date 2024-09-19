import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTag, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import dynamic from 'next/dynamic';

const Valine = dynamic(() => import('../../components/Valine'), { ssr: false });

// 自定义组件
const CustomTable: React.FC<React.ComponentProps<'table'>> = (props) => (
  <div className="my-4 overflow-x-auto">
    <table className="min-w-full leading-normal" {...props} />
  </div>
);

const CustomBlockquote: React.FC<React.ComponentProps<'blockquote'>> = ({ children, ...props }) => (
  <blockquote className="my-2 border-l-4 border-amber-500 pl-4 py-1 bg-amber-50 dark:bg-gray-800 rounded flex items-start" {...props}>
    <FontAwesomeIcon icon={faQuoteLeft} className="mr-2 w-4 h-4 text-amber-500 mt-1" />
    <div>{children}</div>
  </blockquote>
);

const components = {
  table: CustomTable,
  blockquote: CustomBlockquote,
};

interface BlogPostProps {
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
  };
  content: MDXRemoteSerializeResult;
  slug: string;
}

export default function BlogPost({ frontmatter, content, slug }: BlogPostProps) {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-handwriting font-bold mb-4">{frontmatter.title}</h1>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-8 flex-wrap">
          <span className="flex items-center mr-4">
            <FontAwesomeIcon icon={faCalendar} className="mr-2 w-4 h-4" />
            <span>{new Date(frontmatter.date).toLocaleDateString()}</span>
          </span>
          <span className="flex items-center">
            <FontAwesomeIcon icon={faTag} className="mr-2 w-4 h-4" />
            {frontmatter.tags.map((tag, i) => (
              <span key={i} className="mr-2 bg-amber-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">{tag}</span>
            ))}
          </span>
        </div>
        <div className="prose dark:prose-invert prose-amber max-w-none">
          <MDXRemote {...content} components={components} />
        </div>
        
        {/* 添加评论区 */}
        <div className="mt-12">
          <h3 className="text-2xl font-handwriting font-semibold mb-4">评论</h3>
          <Valine path={`/blog/${slug}`} />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames
    .filter(filename => filename.endsWith('.mdx') || filename.endsWith('.md'))
    .map((filename) => ({
      params: { slug: filename.replace(/\.(mdx?|md)$/, '') },
    }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const postsDirectory = path.join(process.cwd(), 'posts');
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  
  let filePath;
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    throw new Error(`No file found for slug: ${slug}`);
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const formattedData = {
    ...data,
    date: data.date instanceof Date ? data.date.toISOString() : new Date(data.date).toISOString(),
  };

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        remarkMath
      ],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [rehypePrism, { ignoreMissing: true }],
        rehypeKatex
      ],
    },
    scope: formattedData,
  });

  return {
    props: {
      frontmatter: formattedData,
      content: mdxSource,
      slug: params?.slug,
    },
  };
};