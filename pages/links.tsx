import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faGlobe, faHeart, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import linksData from '../data/links.json';

interface Link {
  name: string;
  url: string;
  description: string;
}

export async function getStaticProps() {
  return {
    props: {
      links: linksData,
    },
  };
}

export default function Links({ links }: { links: { friendLinks: Link[], otherLinks: Link[], specialThanks: Link[] } }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-amber-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-900 dark:border-amber-50 mx-auto mb-4"></div>
          <p className="text-xl font-handwriting text-amber-900 dark:text-amber-50">正在加载链接...</p>
        </div>
      </div>
    );
  }

  const LinkSection = ({ title, links, icon, description }: { title: string; links: Link[]; icon: any; description?: string }) => (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-handwriting font-bold mb-4 flex items-center text-amber-800 dark:text-amber-200">
        <FontAwesomeIcon icon={icon} className="mr-2 w-5 h-5" /> {/* 调整图标大小 */}
        {title}
      </h2>
      {description && (
        <p className="text-sm text-amber-700 dark:text-amber-300 mb-4 italic">{description}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-100 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className="text-lg font-serif font-semibold mb-2 text-amber-800 dark:text-amber-200">{link.name}</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">{link.description}</p>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-handwriting font-bold mb-8 text-amber-800 dark:text-amber-200">
          <FontAwesomeIcon icon={faLink} className="mr-2 w-6 h-6" /> {/* 调整图标大小 */}
          链接
        </h1>
        
        <LinkSection title="友情链接" links={links.friendLinks} icon={faHandshake} />
        <LinkSection 
          title="其他链接" 
          links={links.otherLinks} 
          icon={faGlobe} 
          description="优秀的博客，以及我会看的博客，网站等"
        />
        <LinkSection 
          title="特别鸣谢" 
          links={links.specialThanks} 
          icon={faHeart} 
          description="这个网站的界面设计参考了："
        />
      </div>
    </Layout>
  );
}