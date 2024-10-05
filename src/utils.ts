export const getMaxIndex = (names: string[], template: RegExp) => {
  return names.reduce((prev, curr) => {
    const currIndex = Number(curr.match(template)?.[1] || "0")
    return Math.max(prev, currIndex)
  }, 0)
}

export const isHTML = (input: string) => {
  const doc = document.createElement("div")
  doc.innerHTML = input
  return doc.innerHTML === input
}
