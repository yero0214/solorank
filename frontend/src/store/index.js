import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

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
        .get('http://localhost:99/call', {
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
      let puuid = ''
      state.infoList.forEach(e => {
        if (e.userName === name) {
          puuid = e.userInfo.puuid
        }
      })
      axios
        .get('http://localhost:99/call', {
          params: {
            uri: `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`,
            token: token
          }
        })
        .then(response => {
          console.log(response.data)
          // this.dispatch('getMatchInfo', name)
        })
        .catch(error => {
          commit('remove', name)
          console.log(error)
        })
    },
    getMatchInfo ({ commit, state }, name) {
      axios
        .get(`http://localhost:99/call?uri=lol/summoner/v4/summoners/by-name/${name}&token=RGAPI-f7c12650-7088-4c19-a634-a9398423afd7`)
        .then(response => {
          commit('setUserInfo', { name: name, data: response.data })
          this.dispatch('getMatchId', name)
        })
        .catch(error => {
          commit('remove', name)
          console.log(error)
        })
    },
    getMatchTimeline ({ commit, state }, name) {
      axios
        .get(`http://localhost:99/call?uri=lol/summoner/v4/summoners/by-name/${name}&token=RGAPI-f7c12650-7088-4c19-a634-a9398423afd7`)
        .then(response => {
          commit('setUserInfo', { name: name, data: response.data })
          this.dispatch('getMatchId', name)
        })
        .catch(error => {
          commit('remove', name)
          console.log(error)
        })
    }
  },
  modules: {
  }
})
