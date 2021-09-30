<template>
  <div class="Search">
    <input type="text" v-model="name" @keyup.enter="search">
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Search',
  props: {
  },
  data () {
    return {
      name: '',
      data: []
    }
  },
  methods: {
    search () {
      this.$store.dispatch('search', this.name)
    },
    getPuuid (name) {
      axios
        .get(`http://localhost:99/call?uri=lol/summoner/v4/summoners/by-name/${name}&token=RGAPI-fddfd8b9-9e9d-4df8-989b-72ed3e356a92`)
        .then(response => {
          this.data.push({ userInfo: response.data })
          // this.getMatchIds(this.data.)
        })
        .catch(error => console.log(error))
    },
    getMatchIds (puuid) {
      axios
        .get(`http://localhost:99/call?uri=/lol/match/v5/matches/by-puuid/${puuid}/ids&token=RGAPI-fddfd8b9-9e9d-4df8-989b-72ed3e356a92`)
        .then(response => (this.data = response.data))
        .catch(error => console.log(error))
    },
    getMatchInfo (matchId) {
      axios
        .get(`http://localhost:99/call?uri=/lol/match/v5/matches/${matchId}&token=RGAPI-fddfd8b9-9e9d-4df8-989b-72ed3e356a92`)
        .then(response => (this.data = response.data))
        .catch(error => console.log(error))
    },
    getMatchTimeline (matchId) {
      axios
        .get(`http://localhost:99/call?/lol/match/v5/matches/${matchId}/timeline&token=RGAPI-fddfd8b9-9e9d-4df8-989b-72ed3e356a92`)
        .then(response => (this.data = response.data))
        .catch(error => console.log(error))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
