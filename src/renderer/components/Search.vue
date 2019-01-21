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
      @keyup.enter="createNote"
      v-shortkey.focus="['meta', 'l']"
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
    updateNoteName: function (e) {
      this.$store.commit('updateNoteName', e.target.value)
    },
    closeWindow: function () {
      require('electron').remote.getCurrentWindow().close()
    },
    minimizeWindow: function () {
      require('electron').remote.getCurrentWindow().minimize()
    },
    maximizeWindow: function () {
      require('electron').remote.getCurrentWindow().setFullScreen(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  box-sizing: border-box;
  padding: 10px;
  background-color: rgba(0,0,0, .1);
  box-shadow: 0 1px 0 rgba(0,0,0, .2);
  -ms-overflow-style: scrollbar;
  -webkit-app-region:drag;
}

input {
  width: 100%;
  height: 40px;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0, .25);
  border: none;
  padding: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #444;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px rgba(0,0,0, .4);
  }
}

.traffic-lights {
  display: flex;
  position: relative;
  top: 15px;
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
}

</style>
