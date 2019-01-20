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
      contents: '',
      dateCreated: new Date()
    })
  },
  saveToFile: function (state) {
    // Turn the state into a string with decent formatting
    const notes = JSON.stringify(state, null, 2)

    // Rewrite the json file that holds our state with the latest store from vue x
    fs.writeFile(remote.app.getPath('desktop') + '/notes.json', notes, finished)

    // Do this when the json file has been rewritten
    function finished () {
      console.log('note saved')
    }
  },
  selectNote: function (state, id) {
    state.selectedNoteID = id
  },
  updateNoteName (state, noteName) {
    state.newNoteName = noteName
  },
  clearNoteName (state) {
    state.newNoteName = ''
  },
  updateNoteContents (state, newContents) {
    state.notes[state.selectedNoteID].contents = newContents
  }
}

const actions = {
  // Run both of these so that the input field is always cleard on new note creation
  createNoteandClearInput: ({commit}, payload) => {
    commit('createNote', payload)
    commit('saveToFile')
    commit('clearNoteName')
  }
}

export default {
  state,
  mutations,
  actions
}

// Todo:
// - [x] Add date created to newly saved notes
// - Add date modified to newly saved notes
// - Allow for sorting by date
// - delete note on keyboard shortcut of command delete
// - Mabye: allow for deleting multiple notes at once with shift click selection
// - Move the json file to it's proper home
// - add preview of note contents next to name listing
