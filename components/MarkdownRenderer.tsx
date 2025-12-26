import React, { useMemo } from 'react';

interface MarkdownRendererProps {
  content: string;
}

const inlineElementsRegex = /(\`[^\`]+\`|\*\*[^\*]+\*\*|\*[^\*]+\*)/;

const renderWithInlineMarkdown = (line: string) => {
    const parts = line.split(inlineElementsRegex);
    return parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-[#0F172A] text-[#00FFE1] font-mono px-1.5 py-1 rounded-md text-sm">{part.slice(1, -1)}</code>;
        }
        return part;
    });
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ content }) => {
  const elements = useMemo(() => {
    const renderLine = (line: string, index: number) => {
        if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
          const headingText = line.replace(/^#+\s/, '');
          return <p key={index} className="text-lg font-bold mt-4 mb-2 text-[#E0E0E0]">{headingText}</p>;
        }
        if (line.startsWith('```')) {
            return null; // Handled in the main loop for full code blocks
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 list-disc text-[#A0A0B0]">{renderWithInlineMarkdown(line.substring(2))}</li>;
        }
        if (line.trim() === '') {
            return <br key={index} />;
        }
        return <p key={index} className="text-[#A0A0B0] my-2 leading-relaxed">{renderWithInlineMarkdown(line)}</p>;
    };

    const lines = content.split('\n');
    const result: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLang = '';

    lines.forEach((line, index) => {
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                result.push(
                    <div key={`codeblock-${index}`} className="bg-[#0F172A]/80 rounded-lg my-4 overflow-hidden">
                        <div className="bg-black/50 px-4 py-2 text-[#00FFE1] font-mono text-sm flex justify-between items-center">
                            <span>{codeBlockLang || 'code'}</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(codeBlockContent.trim())}
                                className="text-[#A0A0B0] hover:text-[#E0E0E0] transition-colors text-xs"
                            >
                                Copy
                            </button>
                        </div>
                        <pre className="p-4 text-[#E0E0E0] font-mono text-sm overflow-x-auto">
                            <code>{codeBlockContent}</code>
                        </pre>
                    </div>
                );
                inCodeBlock = false;
                codeBlockContent = '';
                codeBlockLang = '';
            } else {
                inCodeBlock = true;
                codeBlockLang = line.substring(3).trim();
            }
        } else {
            if (inCodeBlock) {
                codeBlockContent += line + '\n';
            } else {
                const renderedLine = renderLine(line, index);
                if (renderedLine) {
                    result.push(renderedLine);
                }
            }
        }
    });
    return result;
  }, [content]);

  return <div className="prose prose-invert max-w-none">{elements}</div>;
});

export default MarkdownRenderer;