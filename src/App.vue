<template>
  <section>
    <h1>{{interval$}}</h1>
  </section>
</template>

<script>
import { Observable } from "rxjs/Rx"

export default {
  subscriptions: {
    interval$: Observable.interval(1000)
  }
}
</script>

