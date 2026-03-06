import { z } from "zod";
import {
  buildUrl,
  yunxiaoRequest,
  isRegionEdition,
  getRegionDefaultOrganizationId
} from "../../common/utils.js";
import {
  CurrentOrganizationInfoSchema,
  UserOrganizationsInfoSchema,
  CurrentUserSchema,
  OrganizationDepartmentsSchema,
  DepartmentInfoSchema,
  OrganizationRoleSchema,
  ListOrganizationRolesSchema,
  OrganizationRole,
} from "./types.js";

export async function getCurrentOrganizationInfoFunc(
): Promise<z.infer<typeof CurrentOrganizationInfoSchema>> {
  const url = "/oapi/v1/platform/user";

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  const responseData = response as { 
    lastOrganization?: string;
    id?: string; 
    name?: string;
  };

  const mappedResponse = {
    lastOrganization: responseData.lastOrganization, // Organization ID
    userId: responseData.id,                         // Map API's "id" to userId
    userName: responseData.name                      // Map API's "name" to userName
  };

  return CurrentOrganizationInfoSchema.parse(mappedResponse);
}

export async function getUserOrganizationsFunc(
): Promise<z.infer<typeof UserOrganizationsInfoSchema>> {
  const url = "/oapi/v1/platform/organizations";

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return UserOrganizationsInfoSchema.parse(response);
}

export async function getOrganizationDepartmentsFunc(
    organizationId: string,
    parentId?: string
): Promise<z.infer<typeof OrganizationDepartmentsSchema>> {
  const baseUrl = `/oapi/v1/platform/organizations/${organizationId}/departments`;

  const params: Record<string, string | undefined> = {};
  if (parentId) {
    params.parentId = parentId;
  }

  const url = buildUrl(baseUrl, params);

  const response = await yunxiaoRequest(url, {
    method: "GET"
  });

  return OrganizationDepartmentsSchema.parse(response);
}

export async function getOrganizationDepartmentInfoFunc(
  organizationId: string,
  id: string
): Promise<z.infer<typeof DepartmentInfoSchema>> {
  const url = `/oapi/v1/platform/organizations/${organizationId}/departments/${id}`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return DepartmentInfoSchema.parse(response);
}

export async function getOrganizationDepartmentAncestorsFunc(
    organizationId: string,
    id: string): Promise<z.infer<typeof OrganizationDepartmentsSchema>>  {
  const url = `/oapi/v1/platform/organizations/${organizationId}/departments/${id}/ancestors`;
  const response = await yunxiaoRequest(url, {
    method: "GET",
  })
  return OrganizationDepartmentsSchema.parse(response);
};

export async function listOrganizationRolesFunc(
    organizationId: string
): Promise<z.infer<typeof OrganizationRole>> {
    const url = `/oapi/v1/platform/organizations/${organizationId}/roles`;

    const response = await yunxiaoRequest(url, {
        method: "GET"
    });

    return OrganizationRole.parse(response);
}

export async function getOrganizationRoleFunc(
    organizationId: string,
    roleId: string
): Promise<z.infer<typeof OrganizationRoleSchema>> {
    const url = `/oapi/v1/platform/organizations/${organizationId}/roles/${roleId}`;

    const response = await yunxiaoRequest(url, {
        method: "GET"
    });

    return OrganizationRoleSchema.parse(response);
}

export async function getCurrentUserFunc(): Promise<z.infer<typeof CurrentUserSchema>> {
  const url = "/oapi/v1/platform/user";

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return CurrentUserSchema.parse(response);
}

/**
 * 统一解析 organizationId：
 * - region 站：无论传什么 / 不传，最终统一用 getRegionDefaultOrganizationId()
 * - 中心站：
 *   - 传入 explicitOrgId 则使用
 *   - 未传则从 /platform/user 的 lastOrganization 补充
 */
export async function resolveOrganizationId(
  explicitOrgId?: string
): Promise<string> {
  if (isRegionEdition()) {
    // region 模式：统一使用默认占位 orgId
    return getRegionDefaultOrganizationId();
  }

  // 中心站模式
  if (explicitOrgId && explicitOrgId !== "default") {
    return explicitOrgId;
  }

  const info = await getCurrentOrganizationInfoFunc();
  if (!info.lastOrganization) {
    throw new Error("organizationId is required when using Yunxiao central edition");
  }
  return info.lastOrganization;
} 