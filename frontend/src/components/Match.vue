<template>
  <div class="match">
    <div>{{duration}}</div>
    <div>{{player.championName}}</div>
    <div>{{player.kills}}/{{player.deaths}}/{{player.assists}}</div>
    <div>{{result}}</div>
  </div>
</template>

<script>
export default {
  name: 'Match',
  components: {
  },
  props: ['data', 'name'],
  data () {
    return {
    }
  },
  computed: {
    player () {
      let result
      if (this.data.matchInfo != null) {
        this.data.matchInfo.info.participants.forEach(e => {
          if (e.summonerName === this.name) {
            result = e
          }
        })
      }
      return result
    },
    result () {
      if (this.player.win) return 'win'
      else return 'lose'
    },
    duration () {
      const min = Math.floor(this.data.matchInfo.info.gameDuration / 60000)
      const sec = Math.floor((this.data.matchInfo.info.gameDuration % 60000) / 1000)
      return min + ':' + sec
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.match{
  width: 500px;
  height: 100px;
  background-color: rgb(255, 255, 255);
  margin: 10px;
}
</style>
