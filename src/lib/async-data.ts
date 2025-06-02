export type AsyncNotStarted = { status: "NOT_STARTED" }
export type AsyncLoading = { status: "LOADING"; startedAt?: number }
export type AsyncLoaded<T> = { status: "LOADED"; data: T }
export type AsyncFailedToLoad<E> = { status: "FAILED_TO_LOAD"; error: E }
export type AsyncReloading<T> = { status: "RELOADING"; data: T; startedAt?: number }

export type AsyncData<T, E = unknown> =
  | AsyncNotStarted
  | AsyncLoading
  | AsyncLoaded<T>
  | AsyncFailedToLoad<E>
  | AsyncReloading<T>

export function asyncNotStarted(): AsyncNotStarted {
  return { status: "NOT_STARTED" }
}

export function asyncLoading(startedAt: number = Date.now()): AsyncLoading {
  return { status: "LOADING", startedAt }
}

export function asyncLoaded<T>(data: T): AsyncLoaded<T> {
  return { status: "LOADED", data }
}

export function asyncFailedToLoad<_T, E = unknown>(error: E): AsyncFailedToLoad<E> {
  return { status: "FAILED_TO_LOAD", error }
}

export function asyncReloading<T>(data: T, startedAt: number = Date.now()): AsyncReloading<T> {
  return { status: "RELOADING", data, startedAt }
}

export function isLoading<T, E>(state: AsyncData<T, E>): state is AsyncLoading | AsyncReloading<T> {
  return state.status === "LOADING" || state.status === "RELOADING"
}

export function isReady<T, E>(state: AsyncData<T, E>): state is AsyncLoaded<T> | AsyncReloading<T> {
  return state.status === "LOADED" || state.status === "RELOADING"
}

export function hasValue<T, E>(
  state: AsyncData<T, E>
): state is AsyncLoaded<T> | AsyncReloading<T> {
  return state.status === "LOADED" || state.status === "RELOADING"
}

export function hasError<T, E>(state: AsyncData<T, E>): state is AsyncFailedToLoad<E> {
  return state.status === "FAILED_TO_LOAD"
}

export function getLoadingStartedAt<T, E>(state: AsyncData<T, E>): number | undefined {
  return isLoading(state) ? state.startedAt : undefined
}

export function getLoadingInfo<T, E>(
  state: AsyncData<T, E>
): { isLoading: boolean; startedAt: number | undefined } {
  const loading = isLoading(state)
  return {
    isLoading: loading,
    startedAt: loading ? state.startedAt : undefined,
  }
}

export function getValue<T, E>(state: AsyncData<T, E>): T | undefined
export function getValue<T, E>(state: AsyncData<T, E>, fallback: T): T
export function getValue<T, E>(state: AsyncData<T, E>, fallback?: T): T | undefined {
  return hasValue(state) ? state.data : fallback
}
