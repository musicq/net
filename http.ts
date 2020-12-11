import {Observable} from 'rxjs'
import {HttpHeaders} from './headers'
import {Queries, query} from './query'

export interface RequestOptions {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD'
  body?: any
  headers?: Headers | {[key: string]: string}
}

function request<T>(options: RequestOptions) {
  return new Observable(subscriber => {
    const xhr = new XMLHttpRequest()

    xhr.open(options.method, options.url, true)

    // Setup request headers
    const reqHeaders = new HttpHeaders(options.headers)

    if (!reqHeaders.has('Content-Type')) {
      reqHeaders.set('Content-Type', 'application/json; charset=utf-8')
    }

    if (!reqHeaders.has('Accept')) {
      reqHeaders.set('Accept', 'application/json, text/plain, */*')
    }

    reqHeaders.forEach((v, k) => {
      xhr.setRequestHeader(k, v)
    })

    const onLoad = () => {
      let ok = xhr.status >= 200 && xhr.status < 300
      let body = xhr.response || xhr.responseText

      try {
        body = JSON.parse(body)
      } catch (error) {
        ok = false
        body = {error, text: body}
      }

      const headers = new HttpHeaders(xhr.getAllResponseHeaders())

      if (ok) {
        subscriber.next({
          status: xhr.status,
          statusText: xhr.statusText,
          body: body as T,
          url: options.url,
          headers
        })

        subscriber.complete()
      } else {
        subscriber.error({
          status: xhr.status,
          statusText: xhr.statusText,
          error: body,
          url: options.url,
          headers
        })
      }
    }

    const onError = (error: ProgressEvent) => {
      const res = {
        error,
        status: xhr.status || 0,
        statusText: xhr.statusText || 'Unknown Error',
        url: options.url || undefined
      }

      subscriber.error(res)
    }

    xhr.addEventListener('load', onLoad)
    xhr.addEventListener('error', onError)

    xhr.send(
      options.body && typeof options.body === 'string'
        ? options.body
        : JSON.stringify(options.body)
    )

    return () => {
      xhr.removeEventListener('load', onLoad)
      xhr.removeEventListener('error', onError)

      if (xhr.readyState !== xhr.DONE) {
        xhr.abort()
      }
    }
  })
}

function get<T>(url: string, queries?: Queries, options?: RequestOptions) {
  const q = query(queries)
  const u = url + q

  return request<T>({
    ...options,
    url: u,
    method: 'GET'
  })
}

function post<T>(url: string, data?: any, options?: RequestOptions) {
  return request<T>({
    ...options,
    body: data,
    url,
    method: 'POST'
  })
}

function put<T>(url: string, data?: any, options?: RequestOptions) {
  return request<T>({
    ...options,
    body: data,
    url,
    method: 'PUT'
  })
}

function deleteMethod<T>(url: string, data?: any, options?: RequestOptions) {
  return request<T>({
    ...options,
    body: data,
    url,
    method: 'DELETE'
  })
}

export const http = {
  request,
  get,
  post,
  put,
  delete: deleteMethod
}
