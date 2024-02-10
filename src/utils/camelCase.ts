export function convertToCamelCase (input: string): string {
  // Dividir el texto por espacios y convertir cada palabra a minúsculas
  const words = input.toLowerCase().split(' ')

  // Capitalizar la primera letra de cada palabra, excepto la primera
  const camelCaseWords = words.map((word, index) =>
    index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  )

  // Unir las palabras para formar el formato camelCase final
  const camelCaseString = camelCaseWords.join('')

  return camelCaseString
}
