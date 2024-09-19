import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Photo {
  src: string;
  alt: string;
  description: string;
}

const photos: Photo[] = [
  { src: '/images/photo1.jpg', alt: '照片1', description: '这是第一张照片的描述' },
  { src: '/images/photo1.jpg', alt: '照片2', description: '这是第二张照片的描述' },
  { src: '/images/photo1.jpg', alt: '照片3', description: '这是第三张照片的描述' },
  // 添加更多照片...
];

export default function Photos() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-amber-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-900 dark:border-amber-50 mx-auto mb-4"></div>
          <p className="text-xl font-handwriting text-amber-900 dark:text-amber-50">正在加载照片...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8 text-amber-800 dark:text-amber-200">
          <FontAwesomeIcon icon={faImage} className="mr-2" />
          我的照片
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              className="bg-amber-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-48">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-serif font-semibold mb-2 text-amber-800 dark:text-amber-200">{photo.alt}</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">{photo.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}