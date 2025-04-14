// src/services/analysisApi.ts
import axios from 'axios';
// 引入后端定义的仪表盘数据整体 VO 类型 (假设与前端类型结构一致或兼容)
// 如果后端 VO 和前端类型不完全一致，需要在这里或在使用处进行转换
import type { DashboardData } from '@/analysis/types'; // 引入前端定义的类型

// 定义后端响应的基础结构 (与后端 BaseResponse 对应)
interface BackendBaseResponse<T> {
    code: number;
    message: string;
    data: T | null;
}

// 定义 DashboardDataVO 对应的类型 (直接复用前端的类型)
// 注意：这里假设 DashboardDataVO 的结构与前端 DashboardData 完全一致
// 如果不一致，需要单独定义或做映射
type DashboardApiResponse = BackendBaseResponse<DashboardData>;

// API 基础 URL (根据实际后端部署情况调整)
// 在开发环境下，Next.js 可以配置代理来避免 CORS 问题
// 在生产环境下，应配置 Nginx 或后端 CORS 设置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8101/api/';

/**
 * 调用后端 API 获取数据分析仪表盘数据
 *
 * @returns Promise<DashboardData> 返回包含仪表盘数据的 Promise 对象
 * @throws 如果 API 请求失败或返回错误码，则抛出错误
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
    try {
        console.log('正在向后端请求仪表盘数据: GET /api/analysis/dashboard');
        // 发起 GET 请求
        const response = await axios.get<DashboardApiResponse>(`${API_BASE_URL}/analysis/dashboard`);

        // 检查 HTTP 状态码 (axios 默认会处理 2xx 以外的状态码为错误)
        // 检查业务状态码
        if (response.data && response.data.code === 0 && response.data.data) {
            console.log('成功从后端获取仪表盘数据:', response.data.data);
            // 返回 data 部分
            return response.data.data;
        } else {
            // 如果 code 不为 0 或 data 为 null，则视为业务错误
            const errorMessage = `获取仪表盘数据失败: ${response.data?.message || '未知错误'}`;
            console.error(errorMessage, response.data);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('请求 /api/analysis/dashboard 时发生网络或服务器错误:', error);
        // 抛出更详细的错误信息
        if (axios.isAxiosError(error)) {
            throw new Error(`网络错误: ${error.message} (状态码: ${error.response?.status})`);
        } else {
            throw new Error(`获取仪表盘数据时发生未知错误: ${error}`);
        }
    }
};

// 可以在此文件中添加其他与 analysis API 相关的函数