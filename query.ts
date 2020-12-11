export type Queries = {[key: string]: any}

export function query(queries?: Queries) {
  if (!queries) return ''

  return (
    '?' +
    Object.entries(queries)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
  )
}
