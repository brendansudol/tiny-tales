import { v4 as uuid } from "uuid"
import { AsyncData, asyncLoaded, asyncNotStarted } from "@/lib/async-data"
import { Book, Page } from "@/lib/types"

export interface PageDraft extends Omit<Page, "caption" | "image"> {
  caption: AsyncData<string>
  image: AsyncData<string>
}

interface State {
  pages: PageDraft[]
  pageIndex: number
  title: string
  error?: string
}

type Action =
  | { type: "SET_TITLE"; title: string }
  | { type: "SET_PAGE_INDEX"; pageIndex: number }
  | { type: "ADD_PAGE" }
  | { type: "DELETE_PAGE"; pageIndex: number }
  | { type: "UPDATE_PAGE"; pageIndex: number; payload: Partial<PageDraft> }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TITLE":
      return {
        ...state,
        title: action.title,
      }

    case "SET_PAGE_INDEX":
      return {
        ...state,
        pageIndex: action.pageIndex,
      }

    case "DELETE_PAGE": {
      if (state.pages.length <= 1) {
        return {
          ...state,
          pages: [createEmptyPage()],
          pageIndex: 0,
        }
      }

      return {
        ...state,
        pages: state.pages.filter((_, idx) => idx !== action.pageIndex),
        pageIndex: Math.max(0, action.pageIndex - 1),
      }
    }

    case "ADD_PAGE":
      return {
        ...state,
        pages: [...state.pages, createEmptyPage()],
        pageIndex: state.pages.length,
      }

    case "UPDATE_PAGE":
      return {
        ...state,
        pages: state.pages.map((page, idx) =>
          idx === action.pageIndex ? { ...page, ...action.payload } : page
        ),
      }

    default:
      return state
  }
}

export function getInitialState(book: Book, pageIndex: number): State {
  return {
    pages:
      book.pages.length === 0
        ? [createEmptyPage()]
        : book.pages.map((page) => ({
            ...page,
            caption: asyncLoaded(page.caption),
            image: asyncLoaded(page.image),
          })),
    pageIndex: Math.max(0, Math.min(pageIndex, book.pages.length - 1)),
    title: book.title,
  }
}

function createEmptyPage(): PageDraft {
  return {
    id: uuid(),
    caption: asyncNotStarted(),
    image: asyncNotStarted(),
  }
}
