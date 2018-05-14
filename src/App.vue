<template>
  <section class="section">
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
import { from, combineLatest, merge } from "rxjs"
import { fromEvent } from "rxjs/add/observable/fromEvent"
import { pluck, map, mapTo, switchMap, catchError, share } from "rxjs/operators"

export default {
  data(){
    return {
      activeTab: 0
    }
  },
  domStreams: ["click$", "errorImage$"],
  subscriptions() {
    const createLoader = url => 
      from(
        this.$http.get(url)
      )
      .pipe(pluck("data"))

    const cache = {}
    const cachePerson = cache => 
      url => {
        return cache[url] 
          ? cache[url] 
          : (cache[url] = createLoader(url))
      }

    const people$ = createLoader(
      "https://starwars.egghead.training/people"
    )
    .pipe(
      map(people => people.slice(0, 7))
    )

    const activeTab$ = this.$watchAsObservable(
      "activeTab",
      { "immediate": true }
    )
    .pipe(pluck("newValue"))
    
    const person$ = combineLatest(
        activeTab$,        
        people$, 
        (tabId, people) => people[tabId].id)
      .pipe(
        map(id => `https://starwars.egghead.training/people/${id}`),
        switchMap(cachePerson(cache)),
        catchError(err => 
          createLoader("https://starwars.egghead.training/people/2")
        ),
        share() //share RXjs stream for a single request
      )           

    const name$ = person$.pipe(pluck("name"))
    const loadImage$ = person$
      .pipe(
        pluck("image"),
        map(
          image => 
            `https://starwars.egghead.training/${image}`
        )
      )

    const failImage$ = this.errorImage$
      .pipe(mapTo(`http://via.placeholder.com/400x400`))

    const image$ = merge(
      loadImage$,
      failImage$
    )
    
    return {
      people$,
      name$,
      image$      
    }
  }
}
</script>

