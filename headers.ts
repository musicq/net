export class HttpHeaders {
  private headers = new Map<string, string>()

  constructor(headers?: Headers | {[key: string]: string} | string) {
    if (!headers) return

    if (typeof headers === 'string') {
      this.parseResponseHeaders(headers)
    } else if (headers instanceof Headers) {
      this.parseHeaders(headers)
    } else {
      this.parse(headers)
    }
  }

  private parseResponseHeaders(headers: string) {
    const lines = headers.split('\n')

    for (const line of lines) {
      const [k, v] = line.split(':')
      this.headers.set(k, v)
    }
  }

  private parseHeaders(headers: Headers) {
    headers.forEach((v, k) => this.headers.set(k, v))
  }

  private parse(headers: {[key: string]: string}) {
    Object.entries(headers).forEach(([k, v]) => this.headers.set(k, v))
  }

  get(key: string) {
    return this.headers.get(key)
  }

  has(key: string) {
    return this.headers.has(key)
  }

  set(key: string, value: string) {
    this.headers.set(key, value)
  }

  delete(key: string) {
    this.headers.delete(key)
  }

  forEach(cb: (value: string, key: string, map: Map<string, string>) => void) {
    this.headers.forEach(cb)
  }

  valueOf() {
    const obj: {[key: string]: string} = {}

    this.headers.forEach((v, k) => (obj[k] = v))

    return obj
  }
}
