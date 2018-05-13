<template>
  <section class="section">
    <button class="button" v-stream:click="click$">Click</button>
    <h1>{{name$}}</h1>
    <img :src="image$" :alt="image$">
  </section>
</template>

<script>
import { Observable } from "rxjs/Rx"

export default {
  domStreams: ["click$"],
  subscriptions() {
    const person$ = Observable.from(
      this.$http.get(
        "https://starwars.egghead.training/people/1"
      )
    ).pluck("data")
    
    const luke$ = this.click$.switchMap(
      () => person$
    )

    const name$ = luke$.pluck("name")
    const image$ = luke$.pluck("image").map(image => `https://starwars.egghead.training/${image}`)
    
    return {
      name$,
      image$
    }
  }
}
</script>

