<template>
  <section class="section">
    <button class="button" :disabled="disabled$" v-stream:click="{subject: click$, data: 1}">{{buttonText$}}</button>
    <button class="button" :disabled="disabled$" v-stream:click="{subject: click$, data: 4}">{{buttonText$}}</button>
    <button class="button" :disabled="disabled$" v-stream:click="{subject: click$, data: 5}">{{buttonText$}}</button>
    <h1>{{name$}}</h1>
    <img v-stream:error="errorImage$" :src="image$" :alt="image$">
  </section>
</template>

<script>
import { Observable } from "rxjs/Rx"

export default {
  domStreams: ["click$", "errorImage$"],
  subscriptions() {
    const createLoader = url => 
      Observable.from(
        this.$http.get(url)
      )
      .pluck("data")
    
    const luke$ = this.click$
      .pluck("data")
      .map(id =>
        // correct
        `https://starwars.egghead.training/people/${id}`
        // error
        // `https://starwars.egghead.trainin/people/${id}`
      )
      .exhaustMap(createLoader) //waits for the previous request to finish loading
      .catch(err => 
        // Observable.of({name: "Failed... :("})
        // try another URL...
        createLoader("https://starwars.egghead.training/people/2")
      )
      .share() //share RXjs stream for a single request

    // create a disabled stream: [true, false, true, false]
    const disabled$ = Observable.merge(
      this.click$.mapTo(true),
      luke$.mapTo(false)
    )
    .startWith(false)

    const buttonText$ = disabled$      
      .map(bool => 
        bool ? "Loading..." : "Click"
      )

    const name$ = luke$.pluck("name")
    const loadImage$ = luke$
      .pluck("image")
      .map(
        image => 
          // correct
          `https://starwars.egghead.training/${image}`
          // error 
          // `https://starwars.egghead.trainin/${image}`
      )

    const failImage$ = this.errorImage$.mapTo(`http://via.placeholder.com/400x400`)

    const image$ = Observable.merge(
      loadImage$,
      failImage$
    )
    
    return {
      name$,
      image$,
      disabled$,
      buttonText$
    }
  }
}
</script>

