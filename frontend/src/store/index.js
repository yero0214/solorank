import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

const uri = 'http://localhost:99/call'
const token = 'RGAPI-f7c12650-7088-4c19-a634-a9398423afd7'

export default new Vuex.Store({
  state: {
    infoList: []
  },
  mutations: {
    addInfo (state, payload) {
      state.infoList.push({
        userName: payload,
        userInfo: {},
        matchList: {
          matchInfoList: [],
          matchTimelineList: []
        }
      })
    },
    remove (state, payload) {
      state.infoList.forEach((e, i, o) => {
        if (e.userName === payload) {
          o.splice(i, 1)
        }
      })
    },
    setUserInfo (state, payload) {
      state.infoList.forEach(e => {
        if (e.userName === payload.name) {
          e.userInfo = payload.data
        }
      })
    },
    setMatchInfo (state, payload) {
      state.infoList.forEach(e => {
        if (e.userName === payload.name) {
          e.userInfo = payload.data
        }
      })
    },
    setTimeline (state, payload) {
      state.infoList.forEach(e => {
        if (e.userName === payload.name) {
          e.userInfo = payload.data
        }
      })
    }
  },
  actions: {
    search ({ dispatch, commit, state }, name) {
      let found = false
      state.infoList.forEach(e => {
        if (e.userName === name) {
          found = true
        }
      })
      if (!found) {
        commit('addInfo', name)
        dispatch('getUserInfo', name)
      }
    },
    getUserInfo ({ commit, state }, name) {
      axios
        .get(uri, {
          params: {
            uri: `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`,
            token: token
          }
        })
        .then(response => {
          commit('setUserInfo', { name: name, data: response.data })
          this.dispatch('getMatchIdList', name)
        })
        .catch(error => {
          commit('remove', name)
          console.log(error)
        })
    },
    getMatchIdList ({ commit, state }, name) {
      state.infoList.forEach(e => {
        if (e.userName === name) {
          axios
            .get(uri, {
              params: {
                uri: `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${e.userInfo.puuid}/ids?start=0&count=20`,
                token: token
              }
            })
            .then(response => {
              response.data.forEach(matchId => {
                this.dispatch('getMatchInfo', { name: name, matchId: matchId})
                this.dispatch('getMatchTimeLine', { name: name, matchId: matchId})
              })
            })
            .catch(error => {
              commit('remove', name)
              console.log(error)
            })
        }
      })
    },
    getMatchInfo ({ commit, state }, payload) {
      axios
        .get(uri, {
          params: {
            uri: `https://asia.api.riotgames.com/lol/match/v5/matches/${payload.matchId}`,
            token: token
          }
        })
        .then(response => {
          commit('setMatchInfo', { name: payload.name, data: response.data })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getMatchTimeline ({ commit, state }, name) {
      axios
        .get(uri, {
          params: {
            uri: `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline`,
            token: token
          }
        })
        .then(response => {
          commit('setMatchInfo', { name: payload.name, data: response.data })
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  modules: {
  }
})
