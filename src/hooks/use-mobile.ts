import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const mediaQuery = React.useMemo(
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`),
    []
  )

  return React.useSyncExternalStore(
    (onStoreChange) => {
      mediaQuery.addEventListener("change", onStoreChange)
      return () => mediaQuery.removeEventListener("change", onStoreChange)
    },
    () => mediaQuery.matches,
    () => false
  )
}
