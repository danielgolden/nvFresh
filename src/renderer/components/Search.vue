<template>
  <div class="container">
    <div class="traffic-lights">
      <button class="close" @click="closeWindow()"></button>
      <button class="minimize" @click="minimizeWindow()"></button>
      <button class="maximize" @click="maximizeWindow()"></button>
    </div>
    <input
      type="text"
      placeholder="Search or Create"
      :value="newNoteName"
      @input="updateNoteName"
      ref="searchInput"
      @keyup.enter="createNote"
      v-shortkey="['meta', 'l']"
      @shortkey="selectQuery()"
    />
    <!-- <button @click="createNote">Create New Note</button> -->
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
    selectedNoteID () {
      return this.$store.state.Notes.selectedNoteID
    },
    newNoteName () {
      return this.$store.state.Notes.newNoteName
    }
  },
  methods: {
    createNote: function () {
      this.$store.dispatch('createNoteandClearInput')
      this.$emit('newNoteSaved')
    },
    notesByDateModified () {
      return this.$store.getters.notesByDateModified
    },
    updateNoteName: function (e) {
      this.$store.commit('updateNoteName', e.target.value)

      // todo: you should store filteredNotes in the state. Because it's
      // also used in notelist.vue
      let filteredNotes = this.notesByDateModified().filter(note => {
        let nameAndContents = note.name + note.contents
        return nameAndContents
          .toLowerCase()
          .includes(this.newNoteName.toLowerCase())
      })

      if (filteredNotes.length > 0) {
        this.$store.commit('doesQueryHaveMatch', true)
      } else {
        this.$store.commit('doesQueryHaveMatch', false)
      }
    },
    closeWindow: function () {
      require('electron').remote.getCurrentWindow().close()
    },
    minimizeWindow: function () {
      require('electron').remote.getCurrentWindow().minimize()
    },
    maximizeWindow: function () {
      require('electron').remote.getCurrentWindow().setFullScreen(true)
    },
    selectQuery: function () {
      this.$refs['searchInput'].select()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 10px 10px 9px;
  background-image: linear-gradient(rgba(0,0,0, .1), rgba(0,0,0, .2));
  box-shadow: 0 1px 0 rgba(0,0,0, .3);
  -ms-overflow-style: scrollbar;
  -webkit-app-region:drag;
}

input {
  width: 100%;
  height: 35px;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0, .25), 0 1px 0 rgba(255,255,255, .2);
  border: none;
  padding: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #444;
  -webkit-app-region: no-drag;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 1px rgba(0,0,0, .4), 0 1px 0 rgba(255,255,255, .3);
  }
}

.traffic-lights {
  display: flex;
  position: relative;
  top: 13px;
  margin: 0 5px 0 3px;
}

.traffic-lights button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  margin-right: 7px;
}

.close {
  background-color: #FF6159;
  box-shadow: inset 0 0 0 1px rgba(196, 71, 64, .5);
}

.minimize {
  background-color: #FFBD2E;
  box-shadow: inset 0 0 0 1px rgba(204, 150, 34, .5);
}

.maximize {
  background-color: #25C539;
  box-shadow: inset 0 0 0 1px rgba(26, 146, 42, .5);
}

::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: rgba(0,0,0, .3);
}
</style>
