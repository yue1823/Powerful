import React, { useState, useRef } from 'react';
import styled from '@/node_modules/styled-components';
import { IconCopy } from '@/node_modules/@tabler/icons-react';
interface CodeBoxProps {
  code: string;
  language?: string; // 例如: 'javascript', 'python', 'html'
}

const CodeBoxContainer = styled.div`
    background-color: #454444;
    border: 1px solid #333333;
    border-radius: 5px;
    padding: 10px;
    position: relative;
    font-family: monospace;
    overflow-x: auto; /* 允許水平滾動 */
`;

const Code = styled.pre`
  margin: 0;
  white-space: pre-wrap; /* 使長行換行 */
  word-break: break-all; /* 防止單詞溢出容器 */
`;

const CopyButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #4a504a;
    color: #d8d8d8;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
        background-color: #37573a;
    }

    &:focus {
        outline: none;
    }
`;

const CopyMessage = styled.span`
  position: absolute;
  top: 5px;
  right: 70px; /* 調整位置 */
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 0.8em;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &.show {
    opacity: 1;
  }
`;


const CodeBox: React.FC<CodeBoxProps> = ({ code, language = '' }) => {
  const [copyMessageVisible, setCopyMessageVisible] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopyClick = async () => {
    if (!codeRef.current) return;

    try {
      await navigator.clipboard.writeText(codeRef.current.textContent || ''); // 使用 textContent
      setCopyMessageVisible(true);
      setTimeout(() => {
        setCopyMessageVisible(false);
      }, 2000); // 顯示 2 秒
    } catch (err) {
      console.error('無法複製程式碼: ', err);
      alert('複製失敗，請手動複製。'); // 提供 fallback
    }
  };

  return (
    <CodeBoxContainer>
      <CopyButton onClick={handleCopyClick}>
        <IconCopy/></CopyButton>
      <CopyMessage className={copyMessageVisible ? 'show' : ''}>copy！</CopyMessage>
      <Code ref={codeRef} className={`language-${language} text-sky-50`}>
        {code}
      </Code>
    </CodeBoxContainer>
  );
};

export default CodeBox;