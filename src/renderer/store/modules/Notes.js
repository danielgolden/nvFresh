import { remote } from 'electron'

// Pull in nodes file system stuff
const fs = require('fs')

// assign the path of the json file that holds our store to a variable
const data = fs.readFileSync(remote.app.getPath('desktop') + '/notes.json')

// Parse the json data into an object
const state = JSON.parse(data)

const mutations = {
  createNote: function (state) {
    let newNoteID = state.notes.length

    // Update the state
    state.notes.push({
      id: newNoteID,
      name: state.newNoteName,
      content: ''
    })

    // Turn the state into a string with decent formatting
    const notes = JSON.stringify(state, null, 2)

    // Rewrite the json file that holds our state with the latest store from vue x
    fs.writeFile(remote.app.getPath('desktop') + '/notes.json', notes, finished)

    // Do this when the json file has been rewritten
    function finished () {
      console.log('store succesfully updated')
    }
  },
  selectNote: function (state, id) {
    state.selectedNoteID = id
  },
  updateNoteName (state, noteName) {
    state.newNoteName = noteName
  },
  updateNoteContents (state, newContents) {
    state.notes[state.selectedNoteID].contents = newContents
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
