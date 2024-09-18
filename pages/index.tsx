import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faBilibili, faWeixin, faQq } from '@fortawesome/free-brands-svg-icons';
import { faBlog, faProjectDiagram, faChevronDown, faChevronUp, faEnvelope, faUser, faMusic } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Valine = dynamic(() => import('../components/Valine'), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-amber-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-900 dark:border-amber-50 mx-auto mb-4"></div>
          <p className="text-xl font-handwriting text-amber-900 dark:text-amber-50">正在打开书页...</p>
        </div>
      </div>
    );
  }

  const titleText = "导航页";

  const contactItems = [
    { icon: faWeixin, text: 'WeChat', info: '我不给' },
    { icon: faQq, text: 'QQ', info: '2945392910' },
    { icon: faEnvelope, text: 'Email', info: 'hi@10na.cn' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col min-h-screen">
        <motion.h1 
          className="text-4xl md:text-5xl font-handwriting font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {titleText.split('').map((char, index) => (
            <motion.span
              key={index}
              whileHover={{
                scale: 1.2,
                rotate: Math.random() * 20 - 10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <motion.div 
            className="w-full flex flex-col"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex-grow">
              <h2 className="text-2xl font-handwriting font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-3 w-6 h-6" />
                关于我
              </h2>
              <p className="text-lg mb-6 leading-relaxed font-handwriting">
                普通的人，不务正业的学生。成绩不好，脑子不好用，偶尔翻唱，写写代码。
              </p>
              <h2 className="text-2xl font-handwriting font-semibold mb-4 flex items-center mt-8">
                <FontAwesomeIcon icon={faBlog} className="mr-3 w-6 h-6" />
                我的博客
              </h2>
              <p className="text-lg mb-6 leading-relaxed font-handwriting">
                在我的博客中，会分享我的技术、生活感悟、有趣的发现，应该会这样做，也会发布我的翻唱作品，应该。
              </p>
            </div>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/blog"
              className="flex items-center justify-center px-6 py-3 bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 transition-colors font-handwriting rounded-lg text-lg mt-auto"
            >
              <FontAwesomeIcon icon={faBlog} className="mr-3 w-6 h-6" />
              <span>访问我的博客</span>
            </motion.a>
          </motion.div>

          {/* Right column */}
          <motion.div 
            className="w-full flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex-grow">
              <h2 className="text-2xl font-handwriting font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faProjectDiagram} className="mr-3 w-6 h-6" />
                我的链接
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: faGithub, text: 'GitHub', href: 'https://github.com/Ma3h1r0' },
                  { icon: faBilibili, text: 'Bilibili', href: 'https://space.bilibili.com/471437989' },
                  { icon: faMusic, text: '网易云音乐', href: 'https://music.163.com/#/user/home?id=3278562015' }
                ].map((link, index) => (
                  <motion.li key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <a href={link.href} className="flex items-center px-4 py-2 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors font-handwriting rounded-lg">
                      <FontAwesomeIcon icon={link.icon} className="mr-3 w-6 h-6" />
                      <span className="text-lg">{link.text}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button
                className="w-full flex items-center justify-center px-6 py-3 bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 transition-colors font-handwriting rounded-lg text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsContactOpen(!isContactOpen)}
              >
                <FontAwesomeIcon icon={isContactOpen ? faChevronUp : faChevronDown} className="mr-3 w-6 h-6" />
                <span>联系方式</span>
              </motion.button>
              <AnimatePresence>
                {isContactOpen && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden bg-amber-50 dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-gray-600 mt-2"
                  >
                    {contactItems.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="py-2 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center font-handwriting px-4">
                          <FontAwesomeIcon icon={item.icon} className="mr-3 w-6 h-6" />
                          <span className="text-lg">{item.text}: {item.info}</span>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button
            onClick={() => setIsCommentOpen(!isCommentOpen)}
            className="w-full flex items-center justify-between font-handwriting text-2xl font-semibold mb-4 px-6 py-3 bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 transition-colors rounded-lg"
          >
            <span>想对我说</span>
            <FontAwesomeIcon icon={isCommentOpen ? faChevronUp : faChevronDown} className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {isCommentOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-amber-50 dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-gray-600 p-4"
              >
                <Valine />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12 text-center font-handwriting text-base md:text-lg"
        >
          感谢您翻开我的个人书页，希望您能在这里找到有趣的内容。
        </motion.p>
      </div>
    </Layout>
  );
}