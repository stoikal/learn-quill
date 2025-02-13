import React, { useState, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Code from '@tiptap/extension-code';
import Image from '@tiptap/extension-image'
// import './style.css';

const Tiptap = () => {
  const [html, setHtml] = useState('');
  const [isEditingHTML, setIsEditingHTML] = useState(false);

  const editor = useEditor({
    content: '',
    extensions: [
      StarterKit,
      Highlight,
      Code,
      Image
    ],
    onUpdate: ({ editor }) => {
      if (!isEditingHTML) { 
        const newHtml = editor.getHTML();
        setHtml(
          format(newHtml)
        );
      }
    },
    
  });

  if (!editor) {
    return null;
  }

  const handleToggleHTMLMode = () => {
    setIsEditingHTML(!isEditingHTML);

    if (isEditingHTML) { 
      try {
        editor.commands.setContent(html); 
      } catch (error) {
        console.error("Error setting content from HTML:", error);

      }
    } else { 
      setHtml(format(editor.getHTML())); 
    }
  };

  const handleHTMLChange = (event: any) => {
    setHtml(event.target.value);
  };

  return (
    <div className="container">
      <div>
        <h2>Editor</h2>
        {!isEditingHTML ? (
          <EditorContent editor={editor} />
        ) : (
          <textarea
            className="html-editor"
            value={html}
            onChange={handleHTMLChange}
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace"
            }}
          />
        )}
        <br />
        <button onClick={handleToggleHTMLMode}>
          {isEditingHTML ? 'Visual Edit' : 'HTML Edit'}
        </button>
      </div>
      <div>
        <h3>html:</h3>
        <pre id="html-output">{html}</pre>
        <h3>isEditingHTML:</h3>
        <p>{String(isEditingHTML)}</p>
      </div>
    </div>
  );
};


export default Tiptap;

function format(html) {
  var tab = '\t';
  var result = '';
  var indent= '';

  html.split(/>\s*</).forEach(function(element) {
      if (element.match( /^\/\w/ )) {
          indent = indent.substring(tab.length);
      }

      result += indent + '<' + element + '>\r\n';

      if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input")  ) { 
          indent += tab;              
      }
  });

  return result.substring(1, result.length-3);
}