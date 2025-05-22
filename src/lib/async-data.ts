export type AsyncNotStarted = { status: "NOT_STARTED" }
export type AsyncLoading = { status: "LOADING" }
export type AsyncLoaded<T> = { status: "LOADED"; data: T }
export type AsyncFailedToLoad<E> = { status: "FAILED_TO_LOAD"; error: E }
export type AsyncReloading<T> = { status: "RELOADING"; data: T }

export type AsyncData<T, E = unknown> =
  | AsyncNotStarted
  | AsyncLoading
  | AsyncLoaded<T>
  | AsyncFailedToLoad<E>
  | AsyncReloading<T>

export function asyncNotStarted(): AsyncNotStarted {
  return { status: "NOT_STARTED" }
}

export function asyncLoading(): AsyncLoading {
  return { status: "LOADING" }
}

export function asyncLoaded<T>(data: T): AsyncLoaded<T> {
  return { status: "LOADED", data }
}

export function asyncFailedToLoad<_T, E = unknown>(error: E): AsyncFailedToLoad<E> {
  return { status: "FAILED_TO_LOAD", error }
}

export function asyncReloading<T>(data: T): AsyncReloading<T> {
  return { status: "RELOADING", data }
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

export function getValue<T, E>(state: AsyncData<T, E>): T | undefined {
  return hasValue(state) ? state.data : undefined
}
