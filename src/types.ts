export type ProjectProps = {
  id: string
  name: string
  pageClassName: string
  cardTemplates: CardTemplateProps[]
  cardInstances: CardInstanceProps[]
}

export type ListType = "cardTemplates" | "cardInstances"

export type CardTemplateProps = {
  id: string
  name: string
  content: string
}

export type CardInstanceProps = {
  id: string
  name: string
  cardTemplateId: string
  attributes: Record<string, string>
  amount: number
  isHidden: boolean
}

export type RenderedCardsProps = {
  cardInstanceId: string
  content: string
  amount: number
  isHidden?: boolean
  isError?: boolean
}
