<template>
  <section>
    <h1>{{timesTwo$}}</h1>
    <h1>{{square$}}</h1>
  </section>
</template>

<script>
import { Observable } from "rxjs/Rx"

export default {
  subscriptions(){
    const interval$ = Observable.interval(1000)
    const timesTwo$ = interval$.map(i => i * 2)
    const square$ = interval$.map(i => i * i)
    return {
      timesTwo$,
      square$
    }
  }
}
</script>

