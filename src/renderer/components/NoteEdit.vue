<template>
  <div class="note-edit-container" :class="{'no-notes' : notes.length === 0}">
    <div class="empty-state" v-if="notes.length === 0">
      <h3 class="empty-state-header">Add a Note Above</h3>
      <p class="empty-state-description">
        Create a new note by typing in a title into the search/create
        bar above and then press enter.
      </p>
    </div>
    <div
      class="note-contents"
      ref="noteContent"
      :value="currentNoteContents"
      @input="updateNoteContents"
      contentEditable
      v-html="currentNoteContents"
    ></div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      noSearchResults: false
    }
  },
  computed: {
    notes () {
      return this.$store.state.Notes.notes
    },
    selectedNoteID () {
      return this.$store.state.Notes.selectedNoteID
    },
    selectedNoteIndexInList () {
      let currentNoteId = this.selectedNoteID
      return this.notes.findIndex(function (note) { return note.id === currentNoteId })
    },
    newNoteName () {
      return this.$store.state.Notes.newNoteName
    },
    notesByDateModified () {
      return this.$store.getters.notesByDateModified
    },
    filteredNotes () {
      return this.notesByDateModified.filter(note => {
        let nameAndContents = note.name + note.contents
        return nameAndContents
          .toLowerCase()
          .includes(this.newNoteName.toLowerCase())
      })
    },
    currentNoteContents () {
      // let currentNoteId = this.selectedNoteID
      if (this.newNoteName !== '' && this.filteredNotes.length === 0) {
        return ''
      } else if (this.newNoteName !== '' && this.filteredNotes.length > 0) {
        debugger
        let beforeQueryRegEx = new RegExp(`\\s+(?=(${this.newNoteName}))`, 'g')
        let afterQueryRegEx = new RegExp(`\\s+(?=(${this.newNoteName}))`, 'g')
        let noteContents = this.notes[this.selectedNoteIndexInList].contents
        return noteContents.replace(beforeQueryRegEx, ` <span class="query-match">`)
        return noteContents.replace(afterQueryRegEx, `</span> `)
        // return this.currentNoteContents.innerHTML = this.currentNoteContents.innerHTML.replace(this.newNoteName, `<span class="query-match">${this.newNoteName}</span>`)
      } else if (this.notes.length > 0) {
        return this.notes[this.selectedNoteIndexInList].contents
      }
    }
  },
  methods: {
    updateNoteContents: function (e) {
      let dateModified = new Date()
      // let options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }
      // let dateModifiedFormatted = dateModified.toLocaleDateString('en-US', options)

      let payload = {'contents': e.target.innerText, 'dateModified': dateModified}
      this.$store.commit('updateNoteContents', payload)

      // If user types again, restart the timer for saving to the file
      clearTimeout(this.intervalid1)
      this.saveAfterTime()
    },
    saveAfterTime: function () {
      // The context of `this` is changed inside of setTimeout so you have to
      // do something funky like this:
      const self = this
      this.intervalid1 = setTimeout(function () {
        self.$store.commit('saveToFile')
      }, 500)
    }
  }
}
</script>

<style lang="scss">
// turned off scoped styled to allow for .query-match highlighting

.note-edit-container {
  display: flex;
  height: 100%;
  position: relative;

  &.no-notes {
    height: 100%;
  }
}

.note-contents {
  display: block;
  width: 100%;
  flex-grow: 1;
  line-height: 23px;
  padding: 15px;
  font-size: 16px;
  color: #222;
  border: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  border-top: 5px solid rgba(0,0,0, .125);
  resize: none;
  white-space: pre-line;
  overflow: scroll;

  span.query-match {
    background-color: #d7edff;
    border-radius: 1px;
    box-shadow: 0 0 0 2px #d7edff;
    transition: all .2s ease-in-out;
  }

  &:focus {
    outline: none;
  }
}

.empty-state {
  width: 70%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: system-ui;
  text-align: center;
}

.empty-state-header {
  margin-bottom: 10px;
  font-size: 24px;
  color: rgba(0,0,0, .45);
}

.empty-state-description {
    line-height: 22px;
    color: rgba(0,0,0, .5);
}
</style>
