# Net

Net is an HTTP client which is built on top of [`RxJS`](https://rxjs-dev.firebaseapp.com/guide/overview).

## Installation

Using `npm`

```shell
npm install @musicq/net
```

or using `yarn`

```shell
yarn add @musciq/net
```

## Usage

Here's a basic example to raise a HTTP request.

```typescript
import {http} from '@musicq/net'

const request = http.get('/api/todos').pipe(
  map(res => res.body)
)

request.subscribe(res => console.log(res))
```

`net` provides some utilities functions to let us handle error easily.

If you want to return a default value when your requests encounter an exception error. You can use `defaultValue` function.

It will return the default value you provide instead of return an error. This is useful when we need a fallback and don't want to tell if error occurs.

```typescript
import {catchError} from "rxjs/operators";
import {defaultValue} from '@musicq/net'

const request = http.get('/api/todos').pipe(
  map(res => res.body),
  // provide a default value to return it.
  catchError(defaultValue([]))
)
```

Sometimes you may need to show an error tip when there is an error.

You can do it using the native ability of RxJS.

```typescript
import {catchError} from "rxjs/operators";
import {errorWrapper, isError} from '@musicq/net'

const request = http.get('/api/todos').pipe(
  map(res => res.body)
)

request.subscribe(
  res => console.log(res),
  err => console.error(err)
)
```

Or You can use `errorWrapper` in cooperation with `isError` to handle errors.

```typescript
import {catchError} from "rxjs/operators";
import {errorWrapper, isError} from '@musicq/net'

const request = http.get('/api/todos').pipe(
  map(res => res.body),
  // catch the error and wrap it in a HttpErr instance, then return
  catchError(errorWrapper)
)

request.subscribe(res => {
  if (isError(res)) {
    console.log(res.e)
    return
  }

  console.log(res)
})
```

This is handy when you want to unify the process of handling both error and normal responses.

`net` has provided a simple version of `errorWrapper`, called `simpleErrorWrapper` to let you can use it in any other scenarios without Observable.

For example, if you want to handle a Promise error in the same way.

```typescript
import {simpleErrorWrapper, isError} from '@musicq/net';

const request = fetch('/api/todos')
    .then(res => res.json())
    .catch(simpleErrorWrapper)

(async () => {
  const res = await request
  
  if (isError(res)) {
    console.error(res.e)
    return
  }

  console.log(res)
})
```