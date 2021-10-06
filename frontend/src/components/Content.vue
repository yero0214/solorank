<template>
  <div id="content">
    <div v-if="Object.keys(selected).length != 0">
      <div id="info">
        <div id="userInfo">
          <span>{{selected.userInfo.name}}</span>
          <button @click="search">Update</button>
          <div v-if="selected.userInfo.summonerLevel != null">level: {{selected.userInfo.summonerLevel}}</div>
        </div>
        <br>
        <div id="rankInfo" v-if="selected.tierInfo.length >= 2">
          <div>solo: {{solo.tier}} {{solo.rank}} {{solo.leaguePoints}} points</div>
          <div>wins: {{solo.wins}}</div>
          <div>losses: {{solo.losses}}</div>
          <br>
          <div>flex: {{flex.tier}} {{flex.rank}} {{flex.leaguePoints}} points</div>
          <div>wins: {{flex.wins}}</div>
          <div>losses: {{flex.losses}}</div>
        </div>
      </div>
      <div id="summary">
        hi
      </div>
      <div id="matchList">
        <Match v-for="match in selected.matchList" :key="match.matchId" :data="match" :name="selected.userInfo.name"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Match from '@/components/Match.vue'

export default {
  name: 'Content',
  components: {
    Match
  },
  props: [],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    solo () {
      let result
      this.selected.tierInfo.forEach(e => {
        if (e.queueType === 'RANKED_SOLO_5x5') result = e
      })
      return result
    },
    flex () {
      let result
      this.selected.tierInfo.forEach(e => {
        if (e.queueType === 'RANKED_FLEX_SR') result = e
      })
      return result
    }
  },
  methods: {
    search () {
      this.$store.dispatch('search', this.selected.userInfo.name)
    }
  }
}
</script>

<style scoped>
button {
  margin-left: 5px;
}
</style>
