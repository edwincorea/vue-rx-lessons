<template>
  <section class="section">
    {{activeTab$}}
    <b-tabs v-model="activeTab">
      <b-tab-item v-for="person of people$" 
        :key="person.id" 
        :label="person.name"></b-tab-item>
    </b-tabs>

    <h1>{{name$}}</h1>
    <img v-stream:error="errorImage$" 
      :src="image$" 
      :alt="image$">
  </section>
</template>

<script>
import { Observable } from "rxjs/Rx"

export default {
  data(){
    return {
      activeTab: 0
    }
  },
  domStreams: ["click$", "errorImage$"],
  subscriptions() {
    const createLoader = url => 
      Observable.from(
        this.$http.get(url)
      )
      .pluck("data")

    const people$ = createLoader(
      "https://starwars.egghead.training/people"
    )
    .map(people => people.slice(0, 7))

    const activeTab$ = this.$watchAsObservable(
      "activeTab",
      { "immediate": true }
    )
    .pluck("newValue")
    
    const person$ = activeTab$
      .combineLatest(
        people$, 
        (tabId, people) => people[tabId].id)
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

    const name$ = person$.pluck("name")
    const loadImage$ = person$
      .pluck("image")
      .map(
        image => 
          // correct
          `https://starwars.egghead.training/${image}`
          // error 
          // `https://starwars.egghead.trainin/${image}`
      )

    const failImage$ = this.errorImage$
      .mapTo(`http://via.placeholder.com/400x400`)

    const image$ = Observable.merge(
      loadImage$,
      failImage$
    )
    
    return {
      name$,
      image$,
      activeTab$,
      people$
    }
  }
}
</script>

