const state = {
  notes: [
    { id: 0, name: 'first note', contents: 'lorem ipsum dolor' },
    {
      id: 1,
      name: 'Note number 2',
      contents: 'Nulla quis tortor orci. Etiam at risus et justo dignissim.'
    },
    {
      id: 2,
      name: "I'm third!",
      contents:
          'Morbi malesuada nulla nec purus convallis consequat. Vivamus id mollis quam. Morbi ac commodo nulla. '
    }
  ],
  selectedNoteID: 0,
  newNoteName: ''
}

const mutations = {
  createNote: function (state) {
    let newNoteID = state.notes.length

    state.notes.push({
      id: newNoteID,
      name: state.newNoteName,
      content: ''
    })
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
