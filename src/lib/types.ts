export interface Page {
  id: string
  caption: string
  image: string // base64
}

export interface Book {
  id: string // uuid
  title: string
  pages: Page[]
  createdAt: number
}
