<template>
  <div>
    <div class="column-labels">
      <h5 class="title-label">Title</h5>
      <h5 class="date-modified-label">Date Modified</h5>
    </div>
    <div class="note-list-container" v-shortkey="['meta', 'd']" @shortkey="deleteNote(selectedNoteID)">
      <select size="7" ref="filteredNoteList" v-if="filteredNotes.length > 0" @input="selectNote(filteredNotes[$refs.filteredNoteList.selectedIndex].id)">
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
      <select size="7" ref="noteList" v-if="filteredNotes.length <= 0" @input="selectNote(notes[$refs.noteList.selectedIndex].id)">
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
</style>
