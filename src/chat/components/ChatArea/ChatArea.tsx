// src/chat/components/ChatArea/ChatArea.tsx
import React, { useState, useEffect, useRef } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ChatHistory from './ChatHistory';
import InputArea from './InputArea';
import type { ChatMessage, FilePreview, HistoryGroupData, Attachment } from '@/chat/types';

// 定义 ChatArea 组件 props 类型
interface ChatAreaProps {
  initialMessages?: ChatMessage[]; // 初始加载的消息 (可选)
  chatId: string | null; // 当前对话的 ID (可选)
  // 如果需要加载历史记录，可以添加相应的 props
}

/**
 * 右侧主聊天区域组件
 * 管理聊天消息、欢迎屏幕显隐、输入处理等
 * @param initialMessages - （可选）初始加载的聊天消息列表
 * @param chatId - （可选）当前对话的 ID，用于区分不同对话的状态
 */
const ChatArea: React.FC<ChatAreaProps> = ({ initialMessages = [], chatId }) => {
  // --- State ---
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages); // 聊天消息列表
  const [conversationStarted, setConversationStarted] = useState(initialMessages.length > 0); // 是否已开始对话
  const [isSending, setIsSending] = useState(false); // 是否正在发送消息或等待 AI 响应

  // --- Refs ---
  const chatHistoryWrapperRef = useRef<HTMLDivElement>(null); // 引用包含 history 的 wrapper

  // --- Effects ---
   // 当 chatId 变化时，可以加载对应的历史记录 (这里用 useEffect 模拟)
   useEffect(() => {
     if (chatId) {
         console.log(`Loading chat history for chatId: ${chatId}`);
         // TODO: 在此实现从 localStorage 或 API 加载历史记录的逻辑
         // 示例： const loadedMessages = loadMessagesFromStorage(chatId);
         // setMessages(loadedMessages);
         // setConversationStarted(loadedMessages.length > 0);

         // --- 模拟加载 ---
         if (chatId === 'chat1') {
            setMessages([
                { id: 'msg1', type: 'user', content: '你好，今天天气怎么样？', timestamp: Date.now() - 10000 },
                { id: 'msg2', type: 'ai', content: '你好！我暂时无法获取实时天气信息，建议您使用专业天气应用查看。', timestamp: Date.now() - 5000 }
            ]);
            setConversationStarted(true);
         } else if (chatId === 'chat3') {
             setMessages([
                 { id: 'msg3', type: 'user', content: '你是什么模型？介绍一下你自己。', timestamp: Date.now() - 20000 },
                 { id: 'msg4', type: 'ai', content: '我是 DeepForest，一个专注于林业病虫害领域的智能问答系统。我基于先进的 AI 模型和知识图谱构建，旨在为您提供准确、专业的林业信息服务。', timestamp: Date.now() - 15000 }
             ]);
             setConversationStarted(true);
         } else if (chatId) {
             // 对于其他 chat id，清空消息或加载默认欢迎语
             // setMessages([]);
             // setConversationStarted(false);
         }
         // --- 模拟结束 ---

     } else {
         // 如果 chatId 为 null (例如新建对话)，则重置
         setMessages([]);
         setConversationStarted(false);
     }
   }, [chatId]); // 依赖 chatId

  // --- Handlers ---
  // 处理发送消息
    const handleSendMessage = async (text: string, files: File[]) => {
        if (isSending) return; // 防止重复发送

        setIsSending(true); // 开始发送，禁用输入
        setConversationStarted(true); // 标记对话开始

        const userMessageId = `user-${Date.now()}`;
        let userAttachments: Attachment[] = [];

        // 处理文件预览和上传（实际应用需要上传到服务器）
        if (files.length > 0) {
            userAttachments = await Promise.all(files.map(async (file, index) => {
                // 模拟上传并获取 URL，实际应调用上传 API
                // const uploadedUrl = await uploadFileToServer(file);
                const previewUrl = await new Promise<string>(resolve => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(file);
                });
                return {
                    id: `att-${userMessageId}-${index}`,
                    type: file.type.startsWith('image/') ? 'image' : 'file',
                    name: file.name,
                    url: previewUrl, // 暂时使用本地预览 URL
                };
            }));
        }

        // 创建用户消息对象
        const userMessage: ChatMessage = {
            id: userMessageId,
            type: 'user',
            content: text,
            attachments: userAttachments,
            timestamp: Date.now(),
        };

        // 更新消息列表，显示用户消息
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // --- 模拟 AI 响应 ---
        const aiMessageId = `ai-${Date.now()}`;
        const aiThinkingMessage: ChatMessage = {
            id: aiMessageId,
            type: 'ai',
            content: '...', // 初始占位符
            isThinking: true,
            thinkingSteps: ['正在分析您的问题...'],
            timestamp: Date.now() + 100, // 稍微延迟一点
        };
        // 显示 AI 正在思考的消息
        setMessages((prevMessages) => [...prevMessages, aiThinkingMessage]);

        // 模拟思考过程和最终回答
        try {
            // 模拟网络延迟和处理时间
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

            // 更新思考步骤 (可选)
            setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {
                ...msg,
                thinkingSteps: [...(msg.thinkingSteps || []), '检索林业知识库...', '匹配病虫害特征...']
            } : msg));
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

            setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {
                ...msg,
                thinkingSteps: [...(msg.thinkingSteps || []), '生成防治建议...']
            } : msg));
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));


            // 生成模拟回复
            let aiResponseContent = `关于您提到的 "${text || '附件内容'}"...\n`;
            if (text.toLowerCase().includes('松材线虫')) {
                aiResponseContent += `松材线虫病是一种毁灭性的森林病害。\n 主要防治措施包括：\n1.  **疫木清理**: 及时发现并清理感病松树。\n2.  **媒介昆虫防治**: 使用药剂防治天牛等传播媒介。\n3.  **生物防治**: 利用天敌或微生物进行防治。\n4.  **抗病品种选育**: 推广种植抗病松树品种。\n\n\`\`\`json\n{\n  "disease": "松材线虫病",\n  "severity": "High",\n  "control_methods": ["疫木清理", "媒介防治", "生物防治", "抗病育种"]\n}\n\`\`\`\n请注意，具体措施需结合当地实际情况。`;
            } else if (text.toLowerCase().includes('你好') || text.toLowerCase().includes('hello')) {
                 aiResponseContent = "你好！我是 DeepForest，很高兴为您服务。请问有什么林业问题我可以帮助您解答吗？";
            } else {
                 aiResponseContent += "我已经收到您的问题。正在结合知识图谱和相关数据为您分析，请稍候。\n您也可以尝试上传病虫害图片让我识别。";
            }

            // 更新 AI 消息，显示最终回答并结束思考状态
            setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {
                ...msg,
                isThinking: false,
                content: aiResponseContent,
                thinkingSteps: [...(msg.thinkingSteps || []), '生成回答完毕。'] // 添加最后一步
            } : msg));

        } catch (error) {
            console.error("Error simulating AI response:", error);
            // 处理错误，例如显示错误消息
             setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {
                 ...msg,
                 isThinking: false,
                 content: "抱歉，处理请求时遇到问题，请稍后再试。",
             } : msg));
        } finally {
            setIsSending(false); // 结束发送状态，启用输入
        }
        // --- 模拟结束 ---
    };

   // 处理欢迎屏幕上的建议点击
   const handleSuggestionClick = (prompt: string) => {
       // 可以在这里直接发送 prompt，或者填充到输入框让用户确认
       handleSendMessage(prompt, []); // 直接发送
       // 或者：
       // userInputRef.current?.focus(); // 聚焦输入框
       // setUserInput(prompt); // 填充输入框
   };

   // 处理欢迎屏幕“换一换”
   const handleChangePrompt = () => {
       console.log("Change prompt clicked - Implement logic to refresh suggestions");
       // TODO: 实现刷新欢迎屏幕建议的逻辑
   };


  return (
    <main className="chat-area">
      {/* 聊天历史记录外部容器，用于控制滚动 */}
      <div className="chat-history-wrapper" ref={chatHistoryWrapperRef}>
          {/* 欢迎屏幕，仅在对话未开始时显示 */}
          <WelcomeScreen
              isHidden={conversationStarted}
              onSuggestionClick={handleSuggestionClick}
              onChangePrompt={handleChangePrompt}
          />
          {/* 聊天历史记录，仅在对话开始后显示内容或空状态 */}
          {/* ChatHistory 内部处理滚动 */}
          <ChatHistory messages={messages} />
      </div>

      {/* 底部输入区域 */}
      <InputArea onSendMessage={handleSendMessage} isSending={isSending} />
    </main>
  );
};

export default ChatArea;