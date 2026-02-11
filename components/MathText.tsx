import React, { useEffect, useRef } from 'react';

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const win = window as any;
      if (win.katex && win.katex.renderToString) {
        let processedText = text;

        // 1. Thay thế block math (Công thức độc lập): $$...$$ hoặc \[...\]
        processedText = processedText.replace(/\$\$(.*?)\$\$|\\\[(.*?)\\\]/gs, (match, g1, g2) => {
          const mathStr = g1 || g2;
          try {
            return win.katex.renderToString(mathStr, { displayMode: true, throwOnError: false, output: 'html' });
          } catch (e) {
            console.error("KaTeX block render error:", e);
            return match; 
          }
        });

        // 2. Thay thế inline math (Công thức chèn trong dòng): $...$ hoặc \(...\)
        processedText = processedText.replace(/\$(.*?)\$|\\\((.*?)\\\)/gs, (match, g1, g2) => {
          const mathStr = g1 || g2;
          try {
            return win.katex.renderToString(mathStr, { displayMode: false, throwOnError: false, output: 'html' });
          } catch (e) {
            console.error("KaTeX inline render error:", e);
            return match; 
          }
        });
        
        // Cập nhật DOM. Việc sử dụng css whitespace-pre-wrap bên dưới giúp hiển thị ngắt dòng \n 
        // chính xác mà không phá vỡ output HTML phức tạp của KaTeX.
        containerRef.current.innerHTML = processedText;
      } else {
        containerRef.current.innerText = text; // Fallback
      }
    }
  }, [text]);

  return <div ref={containerRef} className={`whitespace-pre-wrap text-slate-800 leading-relaxed ${className}`} />;
};
