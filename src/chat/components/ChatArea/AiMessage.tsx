// src/chat/components/ChatArea/AiMessage.tsx
import React from 'react';
import ThinkingPanel from './ThinkingPanel';
import type { ChatMessage } from '@/chat/types';
import Icon from '@/chat/components/common/Icon';

// 定义 AiMessage 组件 props 类型
interface AiMessageProps {
  message: ChatMessage; // 包含 AI 消息内容、思考状态和步骤的数据
}

/**
 * 显示来自 AI 的消息组件
 * @param message - AI 消息对象，包含内容、思考步骤等
 */
const AiMessage: React.FC<AiMessageProps> = ({ message }) => {
  // 检查是否存在思考步骤或正在思考，以决定是否显示思考面板
  const showThinkingPanel = message.isThinking || (message.thinkingSteps && message.thinkingSteps.length > 0);

   // 格式化最终答案中的代码块等（简单示例，实际可能需要 Markdown 库）
    const formatAnswer = (rawAnswer: string): string => {
        let formatted = rawAnswer;
        // 简单的换行符替换
        formatted = formatted.replace(/\n/g, '<br />');
        // 简单的 Markdown 代码块转换 (```lang\ncode```)
        formatted = formatted.replace(/```(\w*?)\s*<br \/>([\s\S]*?)<br \/>\s*```/g,
            (match, lang, code) => `<pre><code class="language-${lang || 'plaintext'}">${code.replace(/<br \/>/g, '\n').trim()}</code></pre>`
        );
        // 简单的行内代码转换 (`code`)
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        return formatted;
    };

    // 渲染附件 (如果存在)
    const renderAttachments = () => (
        <div className="message-attachments">
            {message.attachments?.map((att) => (
                <div key={att.id} className="attachment-item">
                    {att.type === 'image' ? (
                        <img src={att.url} alt={att.name} className="attachment-image" />
                    ) : (
                        <div className="attachment-file">
                            <Icon name="FileText" size={18} className="feather" />
                            <span className="attachment-filename" title={att.name}>{att.name}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

  return (
    <div className="message ai-message" id={`message-${message.id}`}>
      {/* AI 头像 */}
      <div className="ai-icon-wrapper">
        <div className="ai-icon">
            <Icon name="Feather" size={16} /> {/* 使用林业相关图标 */}
        </div>
      </div>

      {/* 消息内容容器 */}
      <div className="message-content-wrapper">
        <div className="message-content">
          {/* 条件渲染思考过程面板 */}
          {showThinkingPanel && (
            <ThinkingPanel
              steps={message.thinkingSteps || []}
              isThinking={!!message.isThinking}
              // 可以在这里根据需要设置 initialExpanded
            />
          )}

          {/* AI 的最终回答 */}
           {/* 使用 dangerouslySetInnerHTML 来渲染格式化后的 HTML，确保内容是可信的 */}
           {message.content && message.content !== '...' && ( // 只有在有实际内容且不是占位符时渲染
               <div
                   className="ai-answer"
                   dangerouslySetInnerHTML={{ __html: formatAnswer(message.content) }}
               />
           )}
           {/* 如果正在思考且没有最终答案，可以显示一个占位符 */}
           {message.isThinking && message.content === '...' && (
               <div className="ai-answer">正在生成回答...</div>
           )}


           {/* 渲染附件 */}
           {message.attachments && message.attachments.length > 0 && renderAttachments()}
        </div>
      </div>
    </div>
  );
};

export default AiMessage;