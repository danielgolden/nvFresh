import { remote } from 'electron'

// Pull in nodes file system stuff
const fs = require('fs')

// assign the path of the json file that holds our store to a variable
const data = fs.readFileSync(remote.app.getPath('desktop') + '/notes.json')

// Parse the json data into an object
const state = JSON.parse(data)

const mutations = {
  createNote: function (state) {
    let newNoteID = Math.floor(Math.random() * 10000000)

    // Update the state
    state.notes.push({
      id: newNoteID,
      name: state.newNoteName,
      contents: '',
      dateCreated: new Date(),
      dateLastModified: new Date()
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
  updateNoteContents (state, payload) {
    state.notes[state.notes.findIndex(function (note) { return note.id === state.selectedNoteID })].contents = payload.contents
    state.notes[state.notes.findIndex(function (note) { return note.id === state.selectedNoteID })].dateLastModified = payload.dateModified
  },
  deleteNote (state, payload) {
    state.notes.splice(state.notes.findIndex(function (note) { return note.id === payload }), 1)
  }
}

const actions = {
  // Run both of these so that the input field is always cleard on new note creation
  createNoteandClearInput: ({commit}, payload) => {
    commit('createNote')
    commit('saveToFile')
    commit('clearNoteName')
    debugger
    commit('selectNote', state.notes[state.notes.length - 1].id)
  },
  deleteNoteAndSelectNew: ({commit}, payload) => {
    debugger
    commit('deleteNote', payload)
    commit('selectNote', state.notes[0].id)
    commit('saveToFile')
  }
}

export default {
  state,
  mutations,
  actions
}

// Todo:
// - [x] Add date created to newly saved notes
// - [x] Add date modified to newly saved & modified notes
// - [ ] Allow for sorting by date
// - [x] delete note on keyboard shortcut of command delete
// - [ ] Mabye: allow for deleting multiple notes at once with shift click selection
// - [ ] Move the json file to it's proper home
// - [ ] add preview of note contents next to name listing

// To Fix:
// - [x] Bug where when you create a new note on enter, the first note is selected
