import { z } from "zod";
import { yunxiaoRequest, buildUrl, handleRepositoryIdEncoding, isRegionEdition } from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import { 
  DevopsCommitVOSchema as DevopsCommitVOSchemaType
} from "./types.js";

// Commit schemas
export const ListCommitsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径"),
  refName: z.string().describe("分支名称、标签名称或提交版本，默认为代码库默认分支"),
  since: z.string().optional().describe("提交起始时间，格式：YYYY-MM-DDTHH:MM:SSZ"),
  until: z.string().optional().describe("提交截止时间，格式：YYYY-MM-DDTHH:MM:SSZ"),
  page: z.number().int().optional().describe("页码"),
  perPage: z.number().int().optional().describe("每页大小"),
  path: z.string().optional().describe("文件路径"),
  search: z.string().optional().describe("搜索关键字"),
  showSignature: z.boolean().optional().describe("是否展示签名"),
  committerIds: z.string().optional().describe("提交人ID列表（多个ID以逗号隔开）"),
});

export const GetCommitRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径"),
  sha: z.string().describe("提交ID，即Commit SHA值"),
});

export const CreateCommitCommentRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径"),
  sha: z.string().describe("提交的SHA值"),
  content: z.string().describe("commit的评论内容"),
});

// Response schemas
export const DevopsCommitVOSchema = z.object({
  id: z.string().nullable().optional().describe("提交ID"),
  shortId: z.string().nullable().optional().describe("代码组路径"),
  title: z.string().nullable().optional().describe("标题，提交的第一行内容"),
  message: z.string().nullable().optional().describe("提交内容"),
  authorName: z.string().nullable().optional().describe("作者姓名"),
  authorEmail: z.string().nullable().optional().describe("作者邮箱"),
  authoredDate: z.string().nullable().optional().describe("作者提交时间"),
  committerName: z.string().nullable().optional().describe("提交者姓名"),
  committerEmail: z.string().nullable().optional().describe("提交者邮箱"),
  committedDate: z.string().nullable().optional().describe("提交者提交时间"),
  webUrl: z.string().nullable().optional().describe("页面访问地址"),
  parentIds: z.array(z.string()).nullable().optional().describe("父提交ID"),
});

export const DevopsCommitStatVOSchema = z.object({
  additions: z.number().int().nullable().optional().describe("增加行数"),
  deletions: z.number().int().nullable().optional().describe("删除行数"),
  total: z.number().int().nullable().optional().describe("总变动行数"),
});

export const CreateCommitCommentVOSchema = z.object({
  content: z.string().describe("commit的评论内容"),
});

// API functions
export async function listCommits(params: z.infer<typeof ListCommitsRequestSchema>) {
  const {
    organizationId,
    repositoryId,
    refName,
    since,
    until,
    page,
    perPage,
    path,
    search,
    showSignature,
    committerIds
  } = params;

  const finalOrgId = await resolveOrganizationId(organizationId);
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);
  
  const baseUrl = isRegionEdition()
    ? `/oapi/v1/codeup/repositories/${encodedRepoId}/commits`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories/${encodedRepoId}/commits`;

  const queryParams: Record<string, string | number | undefined> = {
    refName: refName
  };
  
  if (since !== undefined) {
    queryParams.since = since;
  }
  
  if (until !== undefined) {
    queryParams.until = until;
  }
  
  if (page !== undefined) {
    queryParams.page = page;
  }
  
  if (perPage !== undefined) {
    queryParams.perPage = perPage;
  }
  
  if (path !== undefined) {
    queryParams.path = path;
  }
  
  if (search !== undefined) {
    queryParams.search = search;
  }
  
  if (showSignature !== undefined) {
    queryParams.showSignature = String(showSignature);
  }
  
  if (committerIds !== undefined) {
    queryParams.committerIds = committerIds;
  }

  const url = buildUrl(baseUrl, queryParams);

  const response: any = await yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(commit => DevopsCommitVOSchemaType.parse(commit));
}

export async function getCommit(params: z.infer<typeof GetCommitRequestSchema>) {
  const { organizationId, repositoryId, sha } = params;
  
  const finalOrgId = await resolveOrganizationId(organizationId);
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);

  const url = isRegionEdition()
    ? `/oapi/v1/codeup/repositories/${encodedRepoId}/commits/${sha}`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories/${encodedRepoId}/commits/${sha}`;

  const response: any = await yunxiaoRequest(url, {
    method: "GET",
  });

  return DevopsCommitVOSchemaType.parse(response);
}

export async function createCommitComment(params: z.infer<typeof CreateCommitCommentRequestSchema>) {
  const { organizationId, repositoryId, sha, content } = params;
  
  const finalOrgId = await resolveOrganizationId(organizationId);
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);

  const url = isRegionEdition()
    ? `/oapi/v1/codeup/repositories/${encodedRepoId}/commits/${sha}/comments`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories/${encodedRepoId}/commits/${sha}/comments`;

  const response: any = await yunxiaoRequest(url, { 
    method: "POST",
    body: { content }
  });

  return response;
}
