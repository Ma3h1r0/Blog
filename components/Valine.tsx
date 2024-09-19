import { useEffect, useRef } from 'react';

interface ValineProps {
  path: string;
}

const Valine: React.FC<ValineProps> = ({ path }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadValine = async () => {
      if (typeof window !== 'undefined' && containerRef.current) {
        const Valine = (await import('valine')).default;
        new Valine({
          el: containerRef.current,
          appId: process.env.NEXT_PUBLIC_VALINE_APP_ID!,
          appKey: process.env.NEXT_PUBLIC_VALINE_APP_KEY!,
          path: path,
          placeholder: '在这里写下你的想法...',
          avatar: 'mp',
          meta: ['nick', 'mail', 'link'],
          pageSize: 10,
          lang: 'zh-CN',
          visitor: false,
          highlight: true,
          recordIP: false,
        });
      }
    };

    loadValine();
  }, [path]);

  return <div ref={containerRef} className="valine-container" />;
};

export default Valine;