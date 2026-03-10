import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import CurrentUserStore from "@/stores/CurrentUserStore";

import usePortalAdmin from "../usePortalAdmin";

describe("usePortalAdmin", () => {
  beforeEach(() => {
    // Reset store to default state
    act(() => {
      CurrentUserStore.setState({
        currentUser: { teams: [] } as any,
      });
    });
  });

  it("returns true for @snjallgogn.is email", () => {
    act(() => {
      CurrentUserStore.setState({
        currentUser: { email: "admin@snjallgogn.is", teams: [] } as any,
      });
    });

    const { result } = renderHook(() => usePortalAdmin());
    expect(result.current.isPortalAdmin).toBe(true);
  });

  it("returns false for other email domains", () => {
    act(() => {
      CurrentUserStore.setState({
        currentUser: { email: "user@example.com", teams: [] } as any,
      });
    });

    const { result } = renderHook(() => usePortalAdmin());
    expect(result.current.isPortalAdmin).toBe(false);
  });

  it("returns false when no email", () => {
    act(() => {
      CurrentUserStore.setState({
        currentUser: { teams: [] } as any,
      });
    });

    const { result } = renderHook(() => usePortalAdmin());
    expect(result.current.isPortalAdmin).toBe(false);
  });
});
