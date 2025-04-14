// src/services/searchApi.ts
import axios from 'axios';
// 引入前端类型
import type { SpeciesDetailData } from '@/search/detail/types';
import type { SearchResultItemVO, PageVO } from './apiTypes'; // 引入下面定义的类型

// --- API 相关类型定义 ---
// 保持与后端 VO 结构一致

// 单个搜索结果项 (对应 SearchResultItemVO)
export interface SearchResultItem {
    id: string;
    type: 'species' | 'document';
    icon?: string; // 后端现在不强制返回，前端可以根据 type 处理
    title: string;
    scientificName?: string;
    classification?: string;
    status?: string;
    statusType?: string; // confirmed, pending, default
    author?: string;
    description: string;
    tags: string[];
    detailLink: string;
}

// 分页响应结构 (对应 PageVO)
export interface PaginatedResponse<T> {
    records: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// 搜索请求参数接口 (对应 SearchRequest)
export interface SearchParams {
    query?: string;
    page?: number;
    pageSize?: number;
    type?: 'species' | 'document'; // 添加类型过滤
    classification?: string;
    status?: string;
    taxonomicLevel?: string; // 注意属性名一致性 (后端是 taxonomicLevel)
    continent?: string;
    country?: string;
    province?: string;
    hostName?: string; // 注意属性名一致性
    hostType?: string;
    refType?: string;
    pubYear?: number;
}


// --- API 调用函数 ---

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8101/api/search';

// 定义后端通用响应体结构
interface BackendBaseResponse<T> {
    code: number;
    message: string;
    data: T | null;
}

/**
 * 调用后端 API 执行搜索
 *
 * @param params 搜索参数 (包含查询、过滤、分页)
 * @returns Promise<PaginatedResponse<SearchResultItem>> 返回分页后的搜索结果
 * @throws 如果 API 请求失败或返回错误码，则抛出错误
 */
export const fetchSearchResults = async (params: SearchParams): Promise<PaginatedResponse<SearchResultItem>> => {
    try {
        console.log('发起搜索请求:', params);
        // 使用 URLSearchParams 来构建查询字符串，自动处理 undefined 参数
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                 // 将驼峰命名转换为下划线命名以匹配后端 SearchRequest (如果需要)
                 // 这里假设后端 @ModelAttribute 能自动处理，或者后端 DTO 使用驼峰命名
                 // 如果后端严格要求下划线，则需要转换 key
                 // const backendKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                 searchParams.append(key, String(value));
            }
        });

        const response = await axios.get<BackendBaseResponse<PaginatedResponse<SearchResultItem>>>(
             API_BASE_URL,
             { params: searchParams } // 将参数对象传递给 axios 的 params 选项
        );

        if (response.data && response.data.code === 0 && response.data.data) {
            console.log(`搜索成功: 共 ${response.data.data.total} 条结果, 当前页 ${response.data.data.page}/${response.data.data.totalPages}`);
            return response.data.data;
        } else {
            const errorMessage = `搜索失败: ${response.data?.message || '未知错误'} (业务码: ${response.data?.code})`;
            console.error(errorMessage, response.data);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('请求 /api/search 时发生网络或服务器错误:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(`网络错误: ${error.message}${error.response ? ` (状态码: ${error.response.status})` : ''}`);
        } else if (error instanceof Error) {
             throw new Error(`搜索时发生错误: ${error.message}`);
        } else {
            throw new Error(`搜索时发生未知错误: ${String(error)}`);
        }
    }
};

/**
 * 调用后端 API 获取物种详细信息
 *
 * @param speciesId 物种 ID
 * @returns Promise<SpeciesDetailData> 返回物种详情数据
 * @throws 如果 API 请求失败、物种未找到或返回错误码，则抛出错误
 */
export const fetchSpeciesDetail = async (speciesId: string): Promise<SpeciesDetailData> => {
    if (!speciesId) {
        throw new Error("物种 ID 不能为空");
    }
    try {
        console.log(`正在请求物种详情: GET ${API_BASE_URL}/species/${speciesId}`);
        const response = await axios.get<BackendBaseResponse<SpeciesDetailData>>(`${API_BASE_URL}/species/${speciesId}`);

        if (response.data && response.data.code === 0 && response.data.data) {
            console.log(`成功获取物种 ${speciesId} 的详情`);
            return response.data.data;
        } else if (response.data && response.data.code === 40400) { // 后端定义的“未找到”错误码
             console.warn(`物种 ${speciesId} 未找到`);
             throw new Error(response.data.message); // 抛出后端返回的“未找到”消息
        } else {
            const errorMessage = `获取物种详情失败: ${response.data?.message || '未知错误'} (业务码: ${response.data?.code})`;
            console.error(errorMessage, response.data);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error(`请求 ${API_BASE_URL}/species/${speciesId} 时发生网络或服务器错误:`, error);
         if (axios.isAxiosError(error) && error.response?.status === 404) {
             // 如果 axios 返回 404，也认为是未找到
              throw new Error(`未找到指定ID的物种信息 (ID: ${speciesId})`);
         } else if (error instanceof Error) {
             // 如果是 fetchSpeciesDetail 内部抛出的错误（如“未找到”），直接 re-throw
             if (error.message.includes("未找到")) {
                  throw error;
             }
             throw new Error(`获取物种详情时发生错误: ${error.message}`);
        } else {
            throw new Error(`获取物种详情时发生未知错误: ${String(error)}`);
        }
    }
};