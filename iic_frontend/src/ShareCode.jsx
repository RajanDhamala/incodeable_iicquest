import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ShareCode() {
  const [codeInput, setCodeInput] = useState('');
  const [sharedCode, setSharedCode] = useState('');

  const handleSubmit = async () => {
    try {
      // Replace URL with your actual backend endpoint
      const response = await fetch('/api/share-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: codeInput }),
      });

      const data = await response.json();
      setSharedCode(data.code); // Assuming the server returns { code: "..." }
    } catch (error) {
      console.error('Failed to send code:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6">
      <h2 className="text-2xl font-semibold mb-4">Share Your Code</h2>

      {/* Input Area */}
      <textarea
        value={codeInput}
        onChange={(e) => setCodeInput(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full bg-[#252526] text-white font-mono text-base rounded-lg p-4 mb-4 border border-[#333] resize-y min-h-[150px]"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-5 py-2 rounded mb-6"
      >
        Share Code
      </button>

      {/* Rendered Code */}
      {sharedCode && (
        <div>
          <h3 className="text-xl font-bold mb-2">Shared Code Snippet</h3>
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            customStyle={{
              padding: '20px',
              borderRadius: '10px',
              fontSize: '1rem',
              lineHeight: '1.7',
              backgroundColor: '#1e1e1e',
            }}
            showLineNumbers
          >
            {sharedCode}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}

export default ShareCode;
