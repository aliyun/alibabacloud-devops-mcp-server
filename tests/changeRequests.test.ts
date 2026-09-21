import assert from "node:assert/strict";
import http from "node:http";
import { after, before, describe, it } from "node:test";
import { runWithAuth } from "../common/utils.js";
import { updateChangeRequestFunc } from "../operations/codeup/changeRequests.js";
import { UpdateChangeRequestSchema } from "../operations/codeup/types.js";

let baseUrl: string;
let receivedRequest: { method?: string; url?: string; body?: unknown };
let server: http.Server;

before(async () => {
  server = http.createServer((req, res) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      receivedRequest = {
        method: req.method,
        url: req.url,
        body: body ? JSON.parse(body) : undefined,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ result: true }));
    });
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(() => new Promise<void>((resolve, reject) =>
  server.close(error => error ? reject(error) : resolve()),
));

describe("updateChangeRequest", () => {
  it("requires a title or description", () => {
    assert.throws(() => UpdateChangeRequestSchema.parse({
      organizationId: "org",
      repositoryId: "repo",
      localId: 42,
    }), /title 和 description 至少传入一个/);
  });

  it("updates title and description in region edition", async () => {
    const previousEdition = process.env.YUNXIAO_EDITION;
    process.env.YUNXIAO_EDITION = "region";
    try {
      const result = await runWithAuth({ token: "token", apiBaseUrl: baseUrl }, () =>
        updateChangeRequestFunc("org", "group/repo", "42", "新标题", "新正文"),
      );
      assert.deepEqual(result, { result: true });
    } finally {
      if (previousEdition === undefined) delete process.env.YUNXIAO_EDITION;
      else process.env.YUNXIAO_EDITION = previousEdition;
    }

    assert.deepEqual(receivedRequest, {
      method: "PUT",
      url: "/oapi/v1/codeup/repositories/group%2Frepo/changeRequests/42",
      body: { title: "新标题", description: "新正文" },
    });
  });

  it("uses the organization path and only sends supplied fields in central edition", async () => {
    const previousEdition = process.env.YUNXIAO_EDITION;
    process.env.YUNXIAO_EDITION = "central";
    try {
      await runWithAuth({ token: "token", apiBaseUrl: baseUrl }, () =>
        updateChangeRequestFunc("org", "repo", "7", undefined, "仅更新正文"),
      );
    } finally {
      if (previousEdition === undefined) delete process.env.YUNXIAO_EDITION;
      else process.env.YUNXIAO_EDITION = previousEdition;
    }

    assert.deepEqual(receivedRequest, {
      method: "PUT",
      url: "/oapi/v1/codeup/organizations/org/repositories/repo/changeRequests/7",
      body: { description: "仅更新正文" },
    });
  });
});
