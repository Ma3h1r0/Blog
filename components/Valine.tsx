import { useEffect, useRef } from 'react';

const Valine = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('valine').then(({ default: Valine }) => {
        new Valine({
          el: containerRef.current,
          appId: process.env.NEXT_PUBLIC_VALINE_APP_ID!,
          appKey: process.env.NEXT_PUBLIC_VALINE_APP_KEY!,
          placeholder: '在这里写下你的想法...',
          avatar: 'mp',
          meta: ['nick', 'mail', 'link'],
          pageSize: 10,
          lang: 'zh-CN',
          visitor: false,
          highlight: true,
          recordIP: false,
        });
      });
    }
  }, []);

  return <div ref={containerRef} className="valine-container text-lg" />;
};

export default Valine;