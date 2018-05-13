<template>
  <section class="section">
    <button class="button" v-stream:click="click$">Click</button>
    <h1>{{random$}}</h1>
  </section>
</template>

<script>
import { Observable } from "rxjs/Rx"

export default {
  domStreams: ["click$"],
  subscriptions() {
    const random$ = this.click$.map(() => Math.random())
    
    return {
      random$
    }
  }
}
</script>

