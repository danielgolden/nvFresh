import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { indentOnInput } from '@codemirror/language';
import { defaultKeymap } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { bracketMatching } from '@codemirror/matchbrackets';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { rectangularSelection } from '@codemirror/rectangular-selection';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { history, historyKeymap } from '@codemirror/history';
import { commentKeymap } from '@codemirror/comment';
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
} from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import Header from './components/Header';
import './App.css';

const Hello = () => {
  return (
    <>
      <Header />
      <CodeMirror
        value="console.log('hello world!');"
        height="100%"
        className="cm-container"
        basicSetup={false}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            spellcheck: 'true',
            autocorrect: 'true',
            autocapitalize: 'off',
          }),
          // subset of basic setup
          keymap.of([...defaultKeymap]),
          highlightSpecialChars(),
          history(),
          drawSelection(),
          dropCursor(),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          defaultHighlightStyle.fallback,
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          rectangularSelection(),
          highlightSelectionMatches(),
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...commentKeymap,
            ...completionKeymap,
          ]),
        ]}
        spellCheck
      />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
