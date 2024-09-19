import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import coversData from '../data/covers.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTag, faStar } from '@fortawesome/free-solid-svg-icons';

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    draft?: boolean;
  };
  content: string;
}

interface Cover {
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  description: string;
  date: string;
}

export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter(filename => filename.endsWith('.md') || filename.endsWith('.mdx'))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: filename.replace(/\.(md|mdx)$/, ''),
        frontmatter: {
          ...data,
          date: data.date instanceof Date ? data.date.toISOString() : new Date(data.date).toISOString(),
          draft: data.draft || false,
        },
        content,
      };
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

  return {
    props: {
      posts: posts.filter((post) => !post.frontmatter.draft),
      covers: coversData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    },
  };
};

export default function Blog({ posts, covers }: { posts: BlogPost[], covers: Cover[] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-900 dark:border-amber-50 mx-auto mb-4"></div>
            <p className="text-xl font-handwriting text-amber-900 dark:text-amber-50">正在翻阅书页...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const allTags = Array.from(new Set(posts.flatMap(post => post.frontmatter.tags)));

  const filteredPosts = selectedTag
    ? posts.filter(post => post.frontmatter.tags.includes(selectedTag))
    : posts;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-handwriting font-bold mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          随便写写，应该可以算作博客吧。
        </motion.h1>

        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-handwriting font-semibold mb-4">
            标签筛选
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <motion.button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1 rounded-full text-sm font-handwriting ${
                  tag === selectedTag
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {filteredPosts.map((post, index) => (
            <motion.article 
              key={post.slug}
              className="mb-12 border-b border-amber-200 dark:border-gray-700 pb-8 relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white px-2 py-1 rounded-bl-lg">
                  <FontAwesomeIcon icon={faStar} className="mr-1 w-3 h-3" />
                  <span className="text-xs">最新</span>
                </div>
              )}
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-2xl font-serif font-semibold mb-2 text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400">{post.frontmatter.title}</h3>
              </Link>
              <div className="text-sm text-amber-700 dark:text-amber-300 mb-4 flex items-center flex-wrap">
                <span className="flex items-center mr-4">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2 w-4 h-4" />
                  <span>{new Date(post.frontmatter.date).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faTag} className="mr-2 w-4 h-4" />
                  {post.frontmatter.tags.map((tag, i) => (
                    <span key={i} className="mr-2">{tag}{i < post.frontmatter.tags.length - 1 ? ',' : ''}</span>
                  ))}
                </span>
              </div>
              <p className="text-amber-900 dark:text-amber-100 font-handwriting mb-4">
                {post.content.slice(0, 150)}...
              </p>
              <Link href={`/blog/${post.slug}`}>
                <span className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 font-handwriting">
                  阅读更多
                </span>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-handwriting font-semibold mb-6">
            我的翻唱
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {covers.slice(0, 3).map((cover, index) => (
              <Link href="/covers" key={index}>
                <motion.div
                  className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={cover.coverImage}
                    alt={cover.title}
                    objectFit="cover"
                    className="rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    width={192}
                    height={192}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-center font-handwriting">
                      <span className="block text-lg font-bold">{cover.title}</span>
                      <span className="block text-sm">{cover.artist}</span>
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}