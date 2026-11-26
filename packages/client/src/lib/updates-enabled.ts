// This build does not update itself. The upstream updater would replace it with the upstream release (which has no
// beadbox:// deep links), so the check never runs and the app never reaches for the network to look for one.
export const UPDATES_ENABLED = false
