import { Box } from "@chakra-ui/react"
import { useContext, useLayoutEffect, useRef, useState, type FC } from "react"
import ProjectContext from "./ProjectContext"

type PreviewCard = {
  key: string
  content: string
}

// Margin-box edges in px, relative to the page's content-box top.
type CardBox = {
  top: number
  bottom: number
}

const findPageStarts = (boxes: CardBox[], pageHeight: number) => {
  const pageStarts = [0]
  let pageTop = boxes[0]?.top ?? 0
  let lineStart = 0
  let lineTop = pageTop

  boxes.forEach((box, index) => {
    if (Math.abs(box.top - lineTop) >= 1) {
      lineStart = index
      lineTop = box.top
    }
    if (box.bottom - pageTop > pageHeight && lineStart !== pageStarts.at(-1)) {
      pageStarts.push(lineStart)
      pageTop = lineTop
    }
  })

  return pageStarts
}

const measurePageStarts = (page: HTMLElement) => {
  const pageStyle = getComputedStyle(page)
  const paddingTop = parseFloat(pageStyle.paddingTop)
  const contentTop = page.getBoundingClientRect().top + paddingTop
  const contentHeight =
    parseFloat(pageStyle.minHeight) -
    paddingTop -
    parseFloat(pageStyle.paddingBottom)

  const boxes = Array.from(page.children, (card) => {
    const rect = card.getBoundingClientRect()
    const cardStyle = getComputedStyle(card)
    return {
      top: rect.top - parseFloat(cardStyle.marginTop) - contentTop,
      bottom: rect.bottom + parseFloat(cardStyle.marginBottom) - contentTop,
    }
  })

  return findPageStarts(boxes, contentHeight)
}

const CardContent: FC<{ card: PreviewCard }> = ({ card }) => (
  <Box dangerouslySetInnerHTML={{ __html: card.content }} />
)

const ScreenPreview: FC<{
  cards: PreviewCard[]
  pageClassName?: string
}> = ({ cards, pageClassName = "" }) => {
  const measureRef = useRef<HTMLDivElement>(null)
  const [pageStarts, setPageStarts] = useState([0])
  const cardKeys = cards.map((card) => card.key).join()

  useLayoutEffect(() => {
    const measurePage = measureRef.current
    if (!measurePage) {
      return
    }

    const observer = new ResizeObserver(() => {
      const next = measurePageStarts(measurePage)
      setPageStarts((prev) => (prev.join() === next.join() ? prev : next))
    })
    observer.observe(measurePage)
    Array.from(measurePage.children).forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [cardKeys, pageClassName])

  const pages = pageStarts
    .map((start, index) => cards.slice(start, pageStarts[index + 1]))
    .filter((page, index) => index === 0 || page.length)

  return (
    <Box id="page-screen">
      {pages.map((page, index) => (
        <Box key={index} className={`page ${pageClassName}`}>
          {page.map((card) => (
            <CardContent key={card.key} card={card} />
          ))}
        </Box>
      ))}

      <Box
        ref={measureRef}
        className={`page page-measure ${pageClassName}`}
        aria-hidden
      >
        {cards.map((card) => (
          <CardContent key={card.key} card={card} />
        ))}
      </Box>
    </Box>
  )
}

const PrintPreview: FC<{
  cards: PreviewCard[]
  pageClassName?: string
}> = ({ cards, pageClassName }) => (
  <Box id="page-print" className={pageClassName}>
    {cards.map((card) => (
      <CardContent key={card.key} card={card} />
    ))}
  </Box>
)

const ProjectPreview: FC<{
  type: "screen" | "print"
}> = ({ type }) => {
  const { project, renderedCards } = useContext(ProjectContext)

  const cards = (renderedCards ?? [])
    .filter((card) => card.content && !card.isHidden)
    .flatMap((card) =>
      Array.from({ length: card.amount }, (_, index) => ({
        key: `${card.cardInstanceId}-${index}`,
        content: card.content,
      })),
    )

  return type === "screen" ? (
    <ScreenPreview cards={cards} pageClassName={project?.pageClassName} />
  ) : (
    <PrintPreview cards={cards} pageClassName={project?.pageClassName} />
  )
}

export default ProjectPreview
