import {Observable, of} from "rxjs";

export class HttpErr {
  constructor(public error: any) {}
}

export function isError(res: any) {
  return res instanceof HttpErr
}

export function defaultValue<T>(defaultValue: T): Observable<T> {
  return of(defaultValue)
}

export function errorWrapper(e: any) {
  return of(new HttpErr(e))
}

export function simpleErrorWrapper(e: any) {
  return new HttpErr(e)
}
