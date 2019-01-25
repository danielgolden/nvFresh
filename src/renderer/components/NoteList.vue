<template>
  <div>
    <div class="column-labels" contenteditable="true">
      <h5 class="title-label">Title</h5>
      <h5 class="date-modified-label">Date Modified</h5>
    </div>
    <div
      class="note-list-container"
      contenteditable="true"
      v-shortkey="{editNoteTitle: ['meta', 'ctrl', 'r'], deleteNote: ['meta', 'd']}"
      @shortkey="handleShortcuts(selectedNoteID)"
    >
      <select
        size="7"
        ref="filteredNoteList"
        v-if="filteredNotes.length > 0"
        @input="selectNote(filteredNotes[$refs.filteredNoteList.selectedIndex].id)"
      >
        <option
          v-for="filteredNote in filteredNotes"
          :key="filteredNote.id"
          :value="shortName(filteredNote.name)"
          :data-date-modified="prettyDateModified(filteredNote.dateLastModified)"
          :class="{ active: selectedNoteID === filteredNote.id }"
        >
          {{ shortName(filteredNote.name) }}
        </option>
      </select>
      <select
        size="7"
        ref="noteList"
        v-if="filteredNotes.length <= 0"
        @input="selectNote(notes[$refs.noteList.selectedIndex].id)"
      >
        <option
          v-for="note in notesByDateModified"
          :key="note.id"
          :value="shortName(note.name)"
          :data-date-modified="prettyDateModified(note.dateLastModified)"
          :class="{ active: selectedNoteID === note.id }"
        >
          {{ shortName(note.name) }}
        </option>
      </select>
    </div>

    <div class="modal edit-name-modal" v-show="updateNoteNameModalActive">
      <h3 class="modal-heading">Rename Note</h3>
      <p class="modal-description">What would you like to rename this note?</p>
      <input type="text" class="edit-name-input" v-model="renameNoteTo" :placeholder="selectedNoteName">
      <button class="cancel" @click="updateNoteNameModalActive = false">Cancel</button>
      <button class="submit" @click="renameNote(renameNoteTo)">Rename</button>
    </div>
    <div class="modal-overlay" v-show="updateNoteNameModalActive"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      updateNoteNameModalActive: false,
      renameNoteTo: ''
    }
  },
  computed: {
    notes () {
      return this.$store.state.Notes.notes
    },
    notesByDateModified () {
      return this.$store.getters.notesByDateModified
    },
    selectedNoteID () {
      return this.$store.state.Notes.selectedNoteID
    },
    selectedNoteName () {
      return this.notes[this.selectedNoteIndexInList].name
    },
    newNoteName () {
      return this.$store.state.Notes.newNoteName
    },
    doesQueryHaveMatch () {
      return this.$store.state.Notes.doesQueryHaveMatch
    },
    filteredNotes () {
      return this.notesByDateModified.filter(note => {
        let nameAndContents = note.name + note.contents
        return nameAndContents
          .toLowerCase()
          .includes(this.newNoteName.toLowerCase())
      })
    },
    selectedNoteIndexInList () {
      let currentNoteId = this.selectedNoteID
      return this.notes.findIndex(function (note) { return note.id === currentNoteId })
    }
  },
  methods: {
    selectNote: function (id) {
      this.$store.commit('selectNote', id)
    },
    handleShortcuts: function (selectedNoteID) {
      switch (event.srcKey) {
        case 'deleteNote':
          this.deleteNote(selectedNoteID)
          break
        case 'editNoteTitle':
          this.updateNoteNameModalActive = true
          break
      }
    },
    deleteNote: function (e, id) {
      let currentNoteId = this.selectedNoteID

      if (window.confirm('You are about to delete the note "' + this.notes[this.notes.findIndex(function (note) { return note.id === currentNoteId })].name + '"!')) {
        this.$store.dispatch('deleteNoteAndSelectNew', this.selectedNoteID)
      }
    },
    isDateToday: function (date) {
      // let today = new Date()
      // let options = {year: 'numeric', month: 'short', day: 'numeric'}
      // let todayFormatted = today.toLocaleDateString('en-US', options)
      // if (date.includes(todayFormatted)) {
      //   return 'Today at ' + date.substring(13, 18) + date.substring(21, 25)
      // } else {
      //   return date.substring(0, 12) + ' at ' + date.substring(13, 18) + date.substring(21, 25)
      // }

      return false
    },
    prettyDateModified (date) {
      this.$moment().calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD/MM/YYYY'
      })

      if (this.$moment(date).isSame(new Date(), 'day')) {
        return this.$moment(date).format('[Today at] hh:mm A')
      } else {
        return this.$moment(date).format('MMM DD, YYYY [at] hh:mm A')
      }
    },
    shortName (fullName) {
      if (fullName.length > 50) {
        return fullName.substring(0, 50) + '...'
      } else {
        return fullName
      }
    },
    renameNote (updatedNoteName) {
      this.$store.dispatch('renameNoteandSave', [updatedNoteName, this.selectedNoteID])
      this.updateNoteNameModalActive = false
    }
  },
  watch: {
    newNoteName (oldValue, newValue) {
      if (this.filteredNotes.length > 0) {
        this.selectNote(this.filteredNotes[0].id)
      }
    }
  }
  // trying select the proper note on page load
  // ,
  // mounted: function () {
  //   debugger
  //   if (this.doesQueryHaveMatch) {
  //     this.$refs.noteList.options.hasClass('active').selected = true
  //   } else {
  //     debugger
  //     this.$refs.filteredNoteList.options[this.notes.findIndex(function (note) { return note.id === this.selectedNoteID })].selected = true
  //   }
  // }
}
</script>

<style scoped lang="scss">
.note-list-container {
  box-sizing: border-box;
  margin: 1px 0 -3px;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 21px;

  select {
    width: 100%;
    font-size: 13px;
    border: none;

    &:focus {
      outline: none;

    }
  }

  option {
    padding: 2px 10px;

    &:hover {
      cursor: default;
    }

    &:after {
      content: attr(data-date-modified);
      width: 153px;
      float: right;
      text-align: left;
      color: rgba(0,0,0, .4);
      transition: color 1s ease-out;
    }

    &.active:after {
      color: rgba(255,255,255, .7);
    }
  }

  select:not(:focus) .active:after {
    color: rgba(0,0,0, .5);
  }
}

.column-labels {
  display: flex;
  padding: 6px 10px 5px;
  position: relative;
  z-index: 10;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.07);
  // background-image: linear-gradient(rgba(255,255,255, .15), rgba(0,0,0, .025));
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.175), 0 3px 0 rgba(0,0,0, .03);

  h5 {
    font-size: 11px;
    font-weight: normal;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: rgba(0, 0, 0, 0.65);
    text-transform: uppercase;
    letter-spacing: .75px;

  }

  .date-modified-label {
    position: relative;
    right: 58px;
  }
}

.modal.edit-name-modal {
  /* max-width: 400px; */
  width: 600px;
  padding: 30px 40px;
  text-align: center;
  height: auto;
  display: block;
  position: absolute;
  background-color: #fff;
  border-radius: 3px;
  top: 50%;
  z-index: 100;
  left: 50%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 5px 30px rgba(0, 0, 0, 0.4);
}


.modal-overlay {
  background-color: rgba(0,0,0, .2);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  -webkit-backdrop-filter: blur(10px);
}

h3.modal-heading {
  font-size: 24px;
  color: rgba(0,0,0, .75);
  margin: 0px 0 9px;
}

p.modal-description {
  font-size: 16px;
  color: rgba(0,0,0, .6);
  margin: 0 0 30px;
}

input.edit-name-input {
  margin-bottom: 40px;
  border-radius:  3px;
  border: 1px solid rgba(0,0,0, .2);
  font-size: 18px;
  padding: 10px 15px;
  color: rgba(0,0,0, .75);
  width: 100%;

  &:focus {
    border: 1px solid rgb(68, 150, 220);
    outline: none;
    box-shadow: 0 0 0 3px rgba(68, 150, 220, .1);
  }
}

.modal button {
    padding: 12px 18px;
    border:  none;
    border-radius:  3px;
    font-size:  16px;
    color:  #fff;
    font-weight: 600;
    cursor: pointer;
}

button.submit {
    background-color: rgb(68, 150, 220);
}

button.cancel {
    margin-right: 10px;
    background-color: transparent;
    box-shadow: inset 0 0 0 2px #9e9e9e;
    color: #989898;
}
</style>
