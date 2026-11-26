import { describe, expect, mock, test } from "bun:test"

// The Tauri updater is replaced so a call to it would be seen.
let checked = 0
mock.module("@tauri-apps/plugin-updater", () => ({
  check: async () => {
    checked++
    return { version: "9.9.9", body: "", date: null }
  },
}))

const { checkForUpdate } = await import("../lib/update-checker")
const { UPDATES_ENABLED } = await import("../lib/updates-enabled")

describe("this build does not update itself", () => {
  test("the flag is off", () => {
    expect(UPDATES_ENABLED).toBe(false)
  })

  test("inside the Tauri shell a check never reaches the updater and reports up to date", async () => {
    ;(window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {}
    try {
      const result = await checkForUpdate("0.35.1")
      expect(result.status).toBe("up-to-date")
      expect(checked).toBe(0)
    } finally {
      delete (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__
    }
  })
})
