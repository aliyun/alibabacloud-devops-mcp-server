import { z } from "zod";

/**
 * 云效的各类 ID(repositoryId / pipelineId / localId ...)在 OpenAPI 里本身就是
 * 数字,模型很自然会传 number,但这些入参原先一律声明为 z.string(),于是大量调用
 * 直接死在入参校验上 —— 线上 7 天 111 次 invalid_type
 * (expected string, received number),list_branches.repositoryId 与
 * get_pipeline.pipelineId 最多。
 *
 * 这里接受 string | number,统一转成 string 供下游拼 URL。
 *
 * ⚠️ 不要图省事换成 z.coerce.string():它会把漏传的必填参数转成字符串
 * "undefined"、把 null 转成 "null",于是拿着一个错误的 ID 去请求云效,把本来清晰
 * 的入参校验失败变成诡异的 404/500。union 会照常拒绝 undefined 与 null。
 *
 * 只用于**入参**。响应 schema 不要用 —— 那些值由云效返回,无需放宽,且 transform
 * 会改变推导出的返回类型。
 */
export const idParam = (description: string) =>
    z.union([z.string(), z.number()]).transform(String).describe(description);
