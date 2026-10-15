import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/builds";

describe("formatPrice", () => {
  it("formats the original amount as USD without converting it", () => {
    expect(formatPrice(1234)).toBe("$1,234");
    expect(formatPrice(1234.5)).toBe("$1,234.5");
  });
});
