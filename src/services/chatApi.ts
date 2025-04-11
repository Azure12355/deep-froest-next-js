// src/services/chatApi.ts
import axios from 'axios';
import type { HistoryGroupData, ChatMessage, Attachment } from '@/chat/types'; // 从你的类型定义中引入

// 定义后端 DTO 类型 (与后端 Java DTO 对应，注意字段名可能需要调整)
// 你也可以选择在 types/index.ts 中定义这些后端特定的 DTO 类型
export interface ChatMessageDto {
    id: string;
    type: 'user' | 'ai';
    content: string;
    thinkingSteps?: string[];
    isThinking?: boolean;
    attachments?: AttachmentDto[]; // 注意这里可能与前端 Attachment 类型有差异
    timestamp: number;
}

interface AttachmentDto {
    id: string;
    type: 'image' | 'file';
    name: string;
    url: string; // 后端提供的 URL
}

interface HistoryItemDto {
    id: string;
    title: string;
}

interface HistoryGroupDto {
    timeframe: string;
    items: HistoryItemDto[];
}

// 定义 SSE 事件的 Payload 类型 (与后端对应)
interface SseChatIdPayload { chatId: string; }
interface SseThinkingStepPayload { step: string; }
interface SseContentChunkPayload { delta: string; }
// final_message 使用 ChatMessageDto
interface SseErrorPayload { message: string; }

// 定义 SSE 事件的统一结构
export interface SseEventData {
    type: 'chat_id' | 'thinking_step' | 'content_chunk' | 'final_message' | 'error' | 'unknown';
    payload: any; // 根据 type 确定具体类型
}


// 后端 API 的基础 URL (应从环境变量读取)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8101/api/chat';

/**
 * 将后端的 DTO 转换为前端的类型 (如果需要)
 * 这里假设 DTO 和前端类型大部分一致，只做简单转换示例
 */
function mapChatMessageDtoToChatMessage(dto: ChatMessageDto): ChatMessage {
    // 注意：附件的转换可能需要根据实际 URL 调整
    const attachments = dto.attachments?.map(attDto => ({
        id: attDto.id,
        type: attDto.type,
        name: attDto.name,
        url: attDto.url, // 可能需要拼接基础 URL 或做其他处理
    } as Attachment)); // 类型断言

    return {
        id: dto.id,
        type: dto.type,
        content: dto.content,
        thinkingSteps: dto.thinkingSteps,
        isThinking: dto.isThinking,
        attachments: attachments,
        timestamp: dto.timestamp,
    };
}

/**
 * 获取聊天历史记录
 * @returns Promise<HistoryGroupData[]>
 */
export const fetchChatHistory = async (): Promise<HistoryGroupData[]> => {
    try {
        const response = await axios.get<HistoryGroupDto[]>(`${API_BASE_URL}/history`);
        // 这里假设 HistoryGroupDto 和 HistoryGroupData 结构一致
        // 如果不一致，需要添加映射逻辑
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error; // 或者返回空数组 return [];
    }
};

/**
 * 获取指定聊天的消息列表
 * @param chatId 聊天 ID
 * @returns Promise<ChatMessage[]>
 */
export const fetchChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
    try {
        const response = await axios.get<ChatMessageDto[]>(`${API_BASE_URL}/${chatId}/messages`);
        // 将 DTO 映射为前端类型
        return response.data.map(mapChatMessageDtoToChatMessage);
    } catch (error) {
        console.error(`Error fetching messages for chat ${chatId}:`, error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn(`Chat ${chatId} not found.`);
            return []; // 返回空数组表示未找到
        }
        throw error; // 其他错误继续抛出
    }
};

/**
 * 发送消息并处理 SSE 流式响应
 * @param prompt 用户输入的文本
 * @param chatId 当前聊天 ID (null 表示新聊天)
 * @param files 用户上传的文件列表
 * @param onSseEvent SSE 事件回调函数，用于更新 UI
 */
export const sendMessageWithSse = async (
    prompt: string,
    chatId: string | null,
    files: File[],
    onSseEvent: (eventData: SseEventData) => void
): Promise<void> => {

    const formData = new FormData();
    formData.append('prompt', prompt);
    if (chatId) {
        formData.append('chatId', chatId);
    }
    files.forEach((file) => {
        formData.append('files', file, file.name); // 确保提供了文件名
    });

    try {
        const response = await fetch(`${API_BASE_URL}/message`, {
            method: 'POST',
            body: formData,
            // 不需要设置 Content-Type，浏览器会自动处理 FormData
            // headers: { 'Accept': 'text/event-stream' } // 可以明确指定接受类型
        });

        if (!response.ok) {
            // 处理非 2xx 状态码
            const errorText = await response.text();
            console.error(`Error sending message: ${response.status} ${response.statusText}`, errorText);
            onSseEvent({ type: 'error', payload: { message: `请求失败: ${response.status} ${errorText || response.statusText}` } });
            return;
        }

        if (!response.body) {
            throw new Error('Response body is null');
        }

        // 处理 SSE 流
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                console.log('SSE stream finished.');
                break; // 流结束
            }

            buffer += value;
            // console.log("Raw SSE chunk:", value); // 调试原始数据

            // 按行处理 SSE 消息 (以 \n\n 分隔)
            let eventEndIndex;
            while ((eventEndIndex = buffer.indexOf('\n\n')) !== -1) {
                const eventBlock = buffer.substring(0, eventEndIndex);
                buffer = buffer.substring(eventEndIndex + 2); // 移除已处理的部分

                // 解析单个事件块
                let eventType: SseEventData['type'] = 'unknown';
                let eventDataJson = '';

                const lines = eventBlock.split('\n');
                lines.forEach(line => {
                    if (line.startsWith('event:')) {
                        eventType = line.substring('event:'.length).trim() as SseEventData['type'];
                    } else if (line.startsWith('data:')) {
                        eventDataJson = line.substring('data:'.length).trim();
                    }
                });

                // console.log(`Parsed SSE Event: type=${eventType}, data=${eventDataJson}`); // 调试解析结果

                if (eventDataJson && eventType !== 'unknown') {
                    try {
                        const payload = JSON.parse(eventDataJson);
                        // 触发回调，传递解析后的事件类型和数据
                        onSseEvent({ type: eventType, payload });
                    } catch (e) {
                        console.error('Error parsing SSE data JSON:', eventDataJson, e);
                         onSseEvent({ type: 'error', payload: { message: `无法解析服务器事件数据: ${eventDataJson}` } });
                    }
                }
            }
        }

    } catch (error) {
        console.error('Error in SSE connection:', error);
        // 通知 UI 发生错误
        onSseEvent({ type: 'error', payload: { message: `连接或处理消息时出错: ${error instanceof Error ? error.message : String(error)}` } });
    }
};
