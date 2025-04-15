// src/services/graphApi.ts
import axios from 'axios';
// 引入前端定义的图谱数据类型
import type { GraphData } from '@/graph/types';

// 定义后端响应的基础结构 (与后端 BaseResponse 对应)
interface BackendBaseResponse<T> {
    code: number;
    message: string;
    data: T | null;
}

// 定义后端返回的图谱数据 VO 类型
// 假设 GraphDataVO 的结构与前端的 GraphData 完全一致或兼容
// 如果不一致，需要在这里定义单独的 VO 类型或在 fetchGraphData 中进行转换
type GraphApiResponse = BackendBaseResponse<GraphData>; // 直接使用前端类型

// API 基础 URL (根据实际后端部署情况调整)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://deepforest.weilanx.com:8101/api';

/**
 * 调用后端 API 获取知识图谱数据
 *
 * @returns Promise<GraphData> 返回包含图谱数据的 Promise 对象
 * @throws 如果 API 请求失败或返回错误码，则抛出错误
 */
export const fetchGraphData = async (): Promise<GraphData> => {
    try {
        console.log('正在向后端请求图谱数据: GET /api/graph/data');
        // 发起 GET 请求
        const response = await axios.get<GraphApiResponse>(`${API_BASE_URL}/graph/data`);

        // 检查业务状态码
        if (response.data && response.data.code === 0 && response.data.data) {
            console.log('成功从后端获取图谱数据。');
            // 返回 data 部分 (已声明为 GraphData 类型)
            return response.data.data;
        } else {
            // 如果 code 不为 0 或 data 为 null，则视为业务错误
            const errorMessage = `获取图谱数据失败: ${response.data?.message || '未知错误'} (业务码: ${response.data?.code})`;
            console.error(errorMessage, response.data);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('请求 /api/graph/data 时发生网络或服务器错误:', error);
        // 抛出更详细的错误信息
        if (axios.isAxiosError(error)) {
            // 如果是 Axios 错误，可以获取更详细信息
            throw new Error(`网络错误: ${error.message}${error.response ? ` (状态码: ${error.response.status})` : ''}`);
        } else if (error instanceof Error) {
            // 如果是 Error 实例，直接抛出其 message
             throw new Error(`获取图谱数据时发生错误: ${error.message}`);
        } else {
            // 其他未知错误
            throw new Error(`获取图谱数据时发生未知错误: ${String(error)}`);
        }
    }
};

// 未来可以添加调用其他图谱 API 的函数
// export const fetchNeighbors = async (nodeId: string): Promise<GraphData> => { ... }
// export const executeCypher = async (query: string): Promise<any> => { ... }