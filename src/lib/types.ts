export interface Page {
  id: string
  caption: string
  image: string
}

export interface Book {
  id: string
  title: string
  pages: Page[]
  createdAt: number
  remoteId?: string
}
