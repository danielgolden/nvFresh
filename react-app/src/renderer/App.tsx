import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
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
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            spellcheck: 'true',
            autocorrect: 'true',
          }),
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
