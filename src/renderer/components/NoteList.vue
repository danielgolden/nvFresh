<template>
  <div class="note-list-container" v-shortkey="['meta', 'd']" @shortkey="deleteNote(selectedNoteID)">
    <select size="7" ref="filteredNoteList" v-if="filteredNotes.length > 0" @input="selectNote(filteredNotes[$refs.filteredNoteList.selectedIndex].id)">
      <option
        v-for="filteredNote in filteredNotes"
        :key="filteredNote.id"
        :value="filteredNote.name"
        :data-date-modified="isDateToday(filteredNote.dateLastModified)"
        :class="{ active: selectedNoteID === filteredNote.id }"
      >
        {{ filteredNote.name }}
      </option>
    </select>
    <select size="7" ref="noteList" v-if="filteredNotes.length <= 0" @input="selectNote(notes[$refs.noteList.selectedIndex].id)">
      <option
        v-for="note in notesByDateModified"
        :key="note.id"
        :value="note.name"
        :data-date-modified="isDateToday(note.dateLastModified)"
        :class="{ active: selectedNoteID === note.id }"
      >
        {{ note.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data () {
    return {}
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
    }
  },
  methods: {
    selectNote: function (id) {
      this.$store.commit('selectNote', id)
    },
    deleteNote: function (e, id) {
      let currentNoteId = this.selectedNoteID

      if (window.confirm('You are about to delete the note "' + this.notes[this.notes.findIndex(function (note) { return note.id === currentNoteId })].name + '"!')) {
        this.$store.dispatch('deleteNoteAndSelectNew', this.selectedNoteID)
      }
    },
    isDateToday: function (date) {
      let today = new Date()
      let options = {year: 'numeric', month: 'short', day: 'numeric'}
      let todayFormatted = today.toLocaleDateString('en-US', options)
      if (date.includes(todayFormatted)) {
        return 'Today at ' + date.substring(13, 18) + date.substring(21, 25)
      } else {
        return date.substring(0, 12) + ' at ' + date.substring(13, 18) + date.substring(21, 25)
      }
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
</style>
