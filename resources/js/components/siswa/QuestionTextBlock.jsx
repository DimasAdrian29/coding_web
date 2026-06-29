const CODE_PATTERNS = [
  /\b(print|console\.log|System\.out\.println|printf|cout|cin|input|return|if|else|for|while|def|class|function|let|const|var|public|static|void|int|string|float|double|boolean)\b/i,
  /[{};<>[\]]/,
  /==|!=|<=|>=|=>|\+\+|--/,
  /^\s*[A-Za-z_][\w.]*\s*=\s*.+/,
  /^\s*[A-Za-z_][\w.]*\s*\(.*\)\s*$/,
  /^\s*(#include|import\s|from\s|package\s)/i,
];

function looksLikeCode(text) {
  const value = String(text ?? "").trim();
  if (!value) return false;

  return CODE_PATTERNS.some((pattern) => pattern.test(value));
}

function isIndentedContinuation(text) {
  return /^\s{2,}\S/.test(String(text ?? ""));
}

function detectLanguage(code) {
  const value = String(code ?? "");
  if (/\bprint\s*\(/.test(value) || /\bdef\s+\w+\s*\(/.test(value)) return "python";
  if (/\bSystem\.out\.println\b|public\s+class\b/.test(value)) return "java";
  if (/#include|cout\s*<</.test(value)) return "cpp";
  if (/console\.log|function\s+\w+\s*\(|const\s+|let\s+/.test(value)) return "javascript";
  return "";
}

function splitInlineCode(text) {
  const value = String(text ?? "").trim();
  const patterns = [
    /^(.+?\))\s+([A-Z][\s\S]+)$/,
    /^(.+?;)\s+([A-Z][\s\S]+)$/,
    /^(.+?[}])\s+([A-Z][\s\S]+)$/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match && looksLikeCode(match[1])) {
      return [
        { type: "code", content: match[1] },
        { type: "text", content: match[2] },
      ];
    }
  }

  return null;
}

function parseQuestionText(text) {
  const value = String(text ?? "");
  const fenced = value.match(/```(\w+)?\s*([\s\S]*?)```/);

  if (fenced) {
    const before = value.slice(0, fenced.index).trim();
    const after = value.slice((fenced.index ?? 0) + fenced[0].length).trim();
    return [
      before ? { type: "text", content: before } : null,
      { type: "code", content: fenced[2].trim(), language: fenced[1] ?? detectLanguage(fenced[2]) },
      after ? { type: "text", content: after } : null,
    ].filter(Boolean);
  }

  const lines = value.split(/\r?\n/);
  if (lines.length > 1) {
    const parts = [];
    let codeBuffer = [];
    let textBuffer = [];

    const flushText = () => {
      if (textBuffer.length) {
        parts.push({ type: "text", content: textBuffer.join("\n").trim() });
        textBuffer = [];
      }
    };
    const flushCode = () => {
      if (codeBuffer.length) {
        const content = codeBuffer.join("\n").replace(/^\s*\n+|\n+\s*$/g, "");
        parts.push({ type: "code", content, language: detectLanguage(content) });
        codeBuffer = [];
      }
    };

    lines.forEach((line) => {
      const isBlankLine = line.trim() === "";
      const isCodeLine = looksLikeCode(line) || (codeBuffer.length > 0 && isIndentedContinuation(line));

      if (isCodeLine) {
        flushText();
        codeBuffer.push(line);
      } else if (isBlankLine && codeBuffer.length > 0) {
        codeBuffer.push(line);
      } else {
        flushCode();
        textBuffer.push(line);
      }
    });

    flushCode();
    flushText();

    return parts.filter((part) => part.content);
  }

  const inlineParts = splitInlineCode(value);
  if (inlineParts) {
    return inlineParts.map((part) => part.type === "code" ? { ...part, language: detectLanguage(part.content) } : part);
  }

  return [{ type: looksLikeCode(value) ? "code" : "text", content: value, language: detectLanguage(value) }];
}

function CodeBlock({ code, language }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
      {language ? (
        <div className="border-b border-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wide text-blue-200">
          {language}
        </div>
      ) : null}
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-7 text-blue-50">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

function QuestionTextBlock({ text, className = "" }) {
  const parts = parseQuestionText(text);

  return (
    <div className={`space-y-3 ${className}`}>
      {parts.map((part, index) => part.type === "code" ? (
        <CodeBlock key={`${part.type}-${index}`} code={part.content} language={part.language} />
      ) : (
        <p key={`${part.type}-${index}`} className="whitespace-pre-line text-base font-extrabold leading-7 text-slate-900">
          {part.content}
        </p>
      ))}
    </div>
  );
}

export default QuestionTextBlock;
