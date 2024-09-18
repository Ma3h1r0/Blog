declare module 'valine' {
    export default class Valine {
      constructor(options: {
        el: Element | null;
        appId: string;
        appKey: string;
        placeholder?: string;
        avatar?: string;
        meta?: string[];
        pageSize?: number;
        lang?: string;
        visitor?: boolean;
        highlight?: boolean;
        recordIP?: boolean;
        [key: string]: any;
      });
    }
  }