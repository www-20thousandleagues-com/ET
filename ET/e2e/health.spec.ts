import { test, expect } from "@playwright/test";

test.describe("Health Checks", () => {
  test("should return 200 on root", async ({ request }) => {
    const response = await request.get("/");
    expect(response.status()).toBe(200);
  });

  test("should return HTML content", async ({ request }) => {
    const response = await request.get("/");
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("text/html");
  });

  test("should serve index.html for SPA routes", async ({ request }) => {
    const response = await request.get("/some-random-path");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('id="root"');
  });
});
