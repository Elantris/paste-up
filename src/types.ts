export type ProjectProps = {
  id: string
  name: string
  pageClassName: string
  cardTemplates: CardTemplateProps[]
  cardInstances: CardInstanceProps[]
}

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
}
