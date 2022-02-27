import './Header.css';

const Header = () => {
  return (
    <div className="header-container">
      <div className="traffic-lights">
        <button
          className="traffic-lights-close"
          onClick={() => closeWindow()}
          type="button"
        >
          Close
        </button>
        <button
          className="traffic-lights-minimize"
          onClick={() => minimizeWindow()}
          type="button"
        >
          Minimize
        </button>
        <button
          className="traffic-lights-maximize"
          onClick={() => maximizeWindow()}
          type="button"
        >
          Maximize
        </button>
      </div>
      <input
        type="text"
        placeholder="Search or Create"
        className="header-search-input"
        // @keyup.enter="createNote"
        // @keydown.prevent.40="focusNotesList"
        // v-shortkey="['meta', 'l']"
        // @shortkey="selectQuery()"
      />
    </div>
  );
};

export default Header;
