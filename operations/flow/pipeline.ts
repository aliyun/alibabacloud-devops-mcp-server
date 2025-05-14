import * as utils from "../../common/utils.js";
import {
  PipelineDetailSchema,
  PipelineDetail,
  ListPipelinesOptions,
  PipelineListItemSchema,
  PipelineListItem,
  CreatePipelineRunOptions,
  PipelineRunSchema,
  PipelineRun,
  PipelineRunListItemSchema,
  PipelineRunListItem,
  ListPipelineRunsOptions
} from "../../common/types.js";

/**
 * 获取流水线详情
 * @param organizationId 组织ID
 * @param pipelineId 流水线ID
 * @returns 流水线详情
 */
export async function getPipelineFunc(
  organizationId: string,
  pipelineId: string
): Promise<PipelineDetail> {
  const url = `/oapi/v1/flow/organizations/${organizationId}/pipelines/${pipelineId}`;

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  return PipelineDetailSchema.parse(response);
}

/**
 * 获取流水线列表
 * @param organizationId 组织ID
 * @param options 查询选项
 * @returns 流水线列表
 */
export async function listPipelinesFunc(
  organizationId: string,
  options?: Omit<ListPipelinesOptions, 'organizationId'>
): Promise<{
  items: PipelineListItem[],
  pagination: {
    nextPage: number | null,
    page: number,
    perPage: number,
    prevPage: number | null,
    total: number,
    totalPages: number
  }
}> {
  const baseUrl = `/oapi/v1/flow/organizations/${organizationId}/pipelines`;
  
  // 构建查询参数
  const queryParams: Record<string, string | number | undefined> = {};
  
  // 处理时间戳参数
  // 如果传入的是日期字符串或Date对象，自动转换为毫秒时间戳
  if (options?.createStartTime !== undefined) {
    queryParams.createStartTime = utils.convertToTimestamp(options.createStartTime);
  }
  
  if (options?.createEndTime !== undefined) {
    queryParams.createEndTime = utils.convertToTimestamp(options.createEndTime);
  }
  
  if (options?.executeStartTime !== undefined) {
    queryParams.executeStartTime = utils.convertToTimestamp(options.executeStartTime);
  }
  
  if (options?.executeEndTime !== undefined) {
    queryParams.executeEndTime = utils.convertToTimestamp(options.executeEndTime);
  }
  
  if (options?.pipelineName !== undefined) {
    queryParams.pipelineName = options.pipelineName;
  }
  
  if (options?.statusList !== undefined) {
    queryParams.statusList = options.statusList;
  }
  
  if (options?.perPage !== undefined) {
    queryParams.perPage = options.perPage;
  }
  
  if (options?.page !== undefined) {
    queryParams.page = options.page;
  }

  const url = utils.buildUrl(baseUrl, queryParams);
  
  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  const pagination = {
    nextPage: null as number | null,
    page: 1,
    perPage: 10,
    prevPage: null as number | null,
    total: 0,
    totalPages: 0
  };

  let items: PipelineListItem[] = [];
  if (Array.isArray(response)) {
    items = response.map(item => PipelineListItemSchema.parse(item));
  }

  return {
    items,
    pagination
  };
}

/**
 * 智能查询流水线列表，能够解析自然语言中的时间表达
 * @param organizationId 组织ID
 * @param timeReference 自然语言时间引用，如"今天"、"本周"、"上个月"
 * @param options 其他查询选项
 * @returns 流水线列表
 */
export async function smartListPipelinesFunc(
  organizationId: string,
  timeReference?: string,
  options?: Omit<ListPipelinesOptions, 'organizationId' | 'executeStartTime' | 'executeEndTime'>
): Promise<{
  items: PipelineListItem[],
  pagination: {
    nextPage: number | null,
    page: number,
    perPage: number,
    prevPage: number | null,
    total: number,
    totalPages: number
  }
}> {
  // 解析时间引用获取开始和结束时间戳
  const { startTime, endTime } = utils.parseDateReference(timeReference);
  
  // 合并选项
  const fullOptions: Omit<ListPipelinesOptions, 'organizationId'> = {
    ...options,
    executeStartTime: startTime,
    executeEndTime: endTime
  };
  
  return listPipelinesFunc(organizationId, fullOptions);
}

/**
 * 运行流水线
 * @param organizationId 组织ID
 * @param pipelineId 流水线ID
 * @param options 运行选项，可以是直接的JSON字符串或者自然语言描述的选项
 * @returns 流水线运行ID
 */
export async function createPipelineRunFunc(
  organizationId: string,
  pipelineId: string,
  options?: Partial<Omit<CreatePipelineRunOptions, 'organizationId' | 'pipelineId'>>
): Promise<number> {
  const url = `/oapi/v1/flow/organizations/${organizationId}/pipelines/${pipelineId}/runs`;
  
  // 如果用户已经提供了格式化的params，直接使用
  if (options?.params) {
    const body = {
      params: options.params
    };

    const response = await utils.yunxiaoRequest(url, {
      method: "POST",
      body: body,
    });

    return Number(response);
  }

  // 否则，基于用户提供的自然语言参数构建params
  const paramsObject: Record<string, any> = {};
  
  // 处理分支模式相关参数
  if (options?.branchMode && options?.branches && options.branches.length > 0) {
    paramsObject.branchModeBranchs = options.branches;
  }
  
  // 处理Release分支相关参数
  if (options?.createReleaseBranch !== undefined) {
    paramsObject.needCreateBranch = options.createReleaseBranch;
  }
  
  if (options?.releaseBranch) {
    paramsObject.releaseBranch = options.releaseBranch;
  }
  
  // 处理环境变量
  if (options?.environmentVariables && Object.keys(options.environmentVariables).length > 0) {
    paramsObject.envs = options.environmentVariables;
  }
  
  // 处理特定仓库配置
  if (options?.repositories && options.repositories.length > 0) {
    // 初始化runningBranchs和runningTags对象
    const runningBranchs: Record<string, string> = {};
    const runningTags: Record<string, string> = {};
    
    // 填充分支和标签信息
    options.repositories.forEach(repo => {
      if (repo.branch) {
        runningBranchs[repo.url] = repo.branch;
      }
      if (repo.tag) {
        runningTags[repo.url] = repo.tag;
      }
    });
    
    // 只有在有内容时才添加到params对象
    if (Object.keys(runningBranchs).length > 0) {
      paramsObject.runningBranchs = runningBranchs;
    }
    
    if (Object.keys(runningTags).length > 0) {
      paramsObject.runningTags = runningTags;
    }
  }
  
  // 如果有自然语言描述，尝试解析它
  if (options?.description) {
    // 此处可以添加更复杂的自然语言处理逻辑
    // 当前实现是简单的关键词匹配
    const description = options.description.toLowerCase();
    
    // 检测分支模式
    if ((description.includes('branch mode') || description.includes('分支模式')) && 
        !paramsObject.branchModeBranchs && 
        options?.branches?.length) {
      paramsObject.branchModeBranchs = options.branches;
    }
    
    // 检测是否需要创建release分支
    if ((description.includes('create release') || description.includes('创建release')) && 
        paramsObject.needCreateBranch === undefined) {
      paramsObject.needCreateBranch = true;
    }
    
    // 如果提到特定release分支但没有指定
    if ((description.includes('release branch') || description.includes('release分支')) && 
        !paramsObject.releaseBranch && 
        options?.branches?.length) {
      // 假设第一个分支就是release分支
      paramsObject.releaseBranch = options.branches[0];
    }
  }

  const body: Record<string, any> = {};

  if (Object.keys(paramsObject).length > 0) {
    body.params = JSON.stringify(paramsObject);
  }
  
  const response = await utils.yunxiaoRequest(url, {
    method: "POST",
    body: body,
  });

  return Number(response);
}

/**
 * 获取最近一次流水线运行信息
 * @param organizationId 组织ID
 * @param pipelineId 流水线ID
 * @returns 最近一次流水线运行信息
 */
export async function getLatestPipelineRunFunc(
  organizationId: string,
  pipelineId: string
): Promise<PipelineRun> {
  const url = `/oapi/v1/flow/organizations/${organizationId}/pipelines/${pipelineId}/runs/latestPipelineRun`;
  
  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  return PipelineRunSchema.parse(response);
}

/**
 * 获取特定流水线运行实例
 * @param organizationId 组织ID
 * @param pipelineId 流水线ID
 * @param pipelineRunId 流水线运行ID
 * @returns 流水线运行实例信息
 */
export async function getPipelineRunFunc(
  organizationId: string,
  pipelineId: string,
  pipelineRunId: string
): Promise<PipelineRun> {
  const url = `/oapi/v1/flow/organizations/${organizationId}/pipelines/${pipelineId}/runs/${pipelineRunId}`;
  
  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  return PipelineRunSchema.parse(response);
}

/**
 * 获取流水线运行实例列表
 * @param organizationId 组织ID
 * @param pipelineId 流水线ID
 * @param options 查询选项
 * @returns 流水线运行实例列表和分页信息
 */
export async function listPipelineRunsFunc(
  organizationId: string,
  pipelineId: string,
  options?: Omit<ListPipelineRunsOptions, 'organizationId' | 'pipelineId'>
): Promise<{
  items: PipelineRunListItem[],
  pagination: {
    nextPage: number | null,
    page: number,
    perPage: number,
    prevPage: number | null,
    total: number,
    totalPages: number
  }
}> {
  const baseUrl = `/oapi/v1/flow/organizations/${organizationId}/pipelines/${pipelineId}/runs`;
  
  // 构建查询参数
  const queryParams: Record<string, string | number | undefined> = {};
  
  if (options?.perPage !== undefined) {
    queryParams.perPage = options.perPage;
  }
  
  if (options?.page !== undefined) {
    queryParams.page = options.page;
  }
  
  if (options?.startTime !== undefined) {
    queryParams.startTime = utils.convertToTimestamp(options.startTime);
  }
  
  if (options?.endTime !== undefined) {
    queryParams.endTme = utils.convertToTimestamp(options.endTime);
  }
  
  if (options?.status !== undefined) {
    queryParams.status = options.status;
  }
  
  if (options?.triggerMode !== undefined) {
    queryParams.triggerMode = options.triggerMode;
  }

  const url = utils.buildUrl(baseUrl, queryParams);
  
  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  const pagination = {
    nextPage: null as number | null,
    page: options?.page ?? 1,
    perPage: options?.perPage ?? 10,
    prevPage: null as number | null,
    total: 0,
    totalPages: 0
  };

  let items: PipelineRunListItem[] = [];
  if (Array.isArray(response)) {
    items = response.map(item => PipelineRunListItemSchema.parse(item));
  }

  return {
    items,
    pagination
  };
}


