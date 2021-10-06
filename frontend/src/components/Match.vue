<template>
  <div class="match" v-if="state">
    <span>{{duration}}</span>
    <span> {{result}}</span>
    <br>
    <span>{{player.championName}}</span>
    <br>
    <span> {{player.kills}}/{{player.deaths}}/{{player.assists}} {{kda}}</span>
    <br>
    <span>cs: {{minion}}({{minionPerMin}})</span>
    <span> gold: {{gold}}({{goldPerMin}})</span>
    <span> visionScore: {{player.visionScore}}</span>
  </div>
</template>

<script>
import comm from '../mixin'

export default {
  name: 'Match',
  Mixins: [comm],
  components: {
  },
  props: ['data', 'name'],
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
    state () {
      if (Object.keys(this.data.matchInfo).length === 0) return false
      else return true
    },
    player () {
      let result
      try {
        this.data.matchInfo.info.participants.forEach(e => {
          if (e.summonerName === this.name) {
            result = e
          }
        })
      } catch (error) {
        return ''
      }
      return result
    },
    result () {
      if (this.player.win) return 'win'
      else return 'lose'
    },
    duration () {
      try {
        const min = '0' + Math.floor(this.data.matchInfo.info.gameDuration / 60000)
        const sec = '0' + Math.floor((this.data.matchInfo.info.gameDuration % 60000) / 1000)
        return min.slice(-2) + ':' + sec.slice(-2)
      } catch (error) {
        console.log(error)
        return ''
      }
    },
    kda () {
      return Math.floor((this.player.kills + this.player.assists) / this.player.deaths * 100) / 100
    },
    gold () {
      return comm.methods.numWithCommas(this.player.goldEarned)
    },
    goldPerMin () {
      try {
        return Math.floor(this.player.goldEarned / Math.floor(this.data.matchInfo.info.gameDuration / 60000))
      } catch (error) {
        return ''
      }
    },
    minion () {
      return comm.methods.numWithCommas(this.player.totalMinionsKilled)
    },
    minionPerMin () {
      try {
        return Math.floor(this.player.totalMinionsKilled / Math.floor(this.data.matchInfo.info.gameDuration / 60000) * 10) / 10
      } catch (error) {
        return ''
      }
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
