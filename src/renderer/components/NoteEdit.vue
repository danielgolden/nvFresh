<template>
  <div class="note-edit-container" :class="{'no-notes' : notes.length === 0}">
    <div class="empty-state" v-if="notes.length === 0">
      <h3 class="empty-state-header">Add a Note Above</h3>
      <p class="empty-state-description">
        Create a new note by typing in a title into the search/create
        bar above and then press enter.
      </p>
    </div>
    <textarea
      ref="noteContent"
      :value="currentNoteContents"
      @input="updateNoteContents"
      :disabled="newNoteName !== '' && filteredNotes.length === 0"
    ></textarea>
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
      let currentNoteId = this.selectedNoteID
      if (this.newNoteName !== '' && this.filteredNotes.length === 0) {
        return ''
      } else if (this.notes.length > 0) {
        return this.notes[this.notes.findIndex(function (note) { return note.id === currentNoteId })].contents
      }
    }
  },
  methods: {
    updateNoteContents: function (e) {
      let dateModified = new Date()
      // let options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }
      // let dateModifiedFormatted = dateModified.toLocaleDateString('en-US', options)

      let payload = {'contents': e.target.value, 'dateModified': dateModified}
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

<style lang="scss" scoped>
.note-edit-container {
  display: flex;
  height: 100%;
  position: relative;

  &.no-notes {
    height: 100%;
  }
}

textarea {
  display: block;
  width: 100%;
  flex-grow: 1;
  line-height: 21px;
  padding: 15px;
  font-size: 14px;
  color: #222;
  border: none;
  border-top: 5px solid rgba(0,0,0, .125);
  resize: none;

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
