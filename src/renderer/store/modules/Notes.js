import { remote } from 'electron'

// Pull in nodes file system stuff
const fs = require('fs')

const gettingStartedData = {
  'notes': [
    {
      'id': 100000,
      'name': 'Welcome to nvFresh!',
      'contents': "nvFresh supports Markdown and has preview built in. Just press `Command + Shift + p` to preview your note in Markdown.*\n\nThanks for trying out nvFresh, the minimal notes app based on [nvALT] designed around the use of [Markdown]. There are 3 main sections in \nnvFresh where you create, search, and choose your notes:\n\n- **Search/Create bar**: type into this bar to search the names and contents of every note you've created! To create a note, just press enter after typing into the bar, and a note will be with your text as the title.\n- **Notes List**: All of your notes live here, ordered by date last modified.\n- **Editor**: This is where you write and update your notes (it's where you're reading this).\n\n---\n\n\n### Feedback\nI'd love to hear your ideas for how nvFresh can be improved, or if you find some bugs! Feel free to get in touch via [Twitter](https://twitter.com/DanGolden1) or submit an issue on  [GitHub](https://github.com/danielgolden/nvFresh).\n\nnvFresh is based on [nvALT](http://brettterpstra.com/projects/nvalt/), which is based on [Notational Velocity](http://notational.net/).\n\n[nvAlt]: http://brettterpstra.com/projects/nvalt/\n[Markdown]: https://guides.github.com/features/mastering-markdown/",
      'dateCreated': '2019-01-21T11:22:55.343Z',
      'dateLastModified': '2019-01-26T17:33:08.761Z'
    },
    {
      'id': 8274110,
      'name': 'How to do other stuff',
      'contents': "nvFresh's window was designed for keyboard input above all else, and that's why it doesn't have any buttons (mostly). Everything you'd want to do is handled by keyboard shortcuts. The beauty of this is you won't need to take your hands off of the keyboard to to create and mange your notes (or really anything).\n\n## Keyboard Shortcuts\n*On Windows \"Ctrl\" should be used instead of \"Command\"*\n- `Command + l`: Move focus and the cursor the the search/create bar\n- `Up and Down arrows`: Navigate through your notes.\n- `Command + Shift + P`: Markdown Preview\n- `Command + R`: Rename a note.\n",
      'dateCreated': '2019-01-25T22:00:37.979Z',
      'dateLastModified': '2019-01-26T14:35:11.392Z'
    }
  ],
  'selectedNoteID': 100000,
  'newNoteName': '',
  'doesQueryHaveMatch': true
}

let data = ''

if (fs.existsSync(remote.app.getPath('userData') + '/notes.json')) {
  // assign the path of the json file that holds our store to a variable
  data = fs.readFileSync(remote.app.getPath('userData') + '/notes.json')
} else {
  data = JSON.stringify(gettingStartedData)
}

// Parse the json data into an object
const state = JSON.parse(data)

const getters = {
  notesByDateModified: state => {
    return state.notes.concat().sort(function (a, b) {
      return Date.parse(b.dateLastModified) - Date.parse(a.dateLastModified)
    })
  }
}

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
    fs.writeFile(remote.app.getPath('userData') + '/notes.json', notes, finished)

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
  doesQueryHaveMatch (state, binary) {
    state.doesQueryHaveMatch = binary
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
  },
  renameNote (state, payload) {
    let indexOfRenamedNoted = state.notes.findIndex(note => note.id === payload[1])
    state.notes[indexOfRenamedNoted].name = payload[0]
    state.notes[indexOfRenamedNoted].dateLastModified = payload[2]
  }
}

const actions = {
  // Run both of these so that the input field is always cleard on new note creation
  createNoteandClearInput: ({commit}, payload) => {
    commit('createNote')
    commit('updateNoteName', '')
    commit('saveToFile')
    commit('clearNoteName')
    setTimeout(function () {
      commit('selectNote', state.notes[state.notes.length - 1].id)
    }, 10)
  },
  deleteNoteAndSelectNew: ({commit}, payload) => {
    commit('deleteNote', payload)
    if (state.notes.length > 0) {
      commit('selectNote', state.notes[0].id)
    }
    commit('saveToFile')
  },
  renameNoteandSave: ({commit}, payload) => {
    commit('renameNote', payload)
    commit('saveToFile')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
