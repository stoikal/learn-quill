import React, { useState } from 'react';
import { EditorContent, useEditor, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Code from '@tiptap/extension-code';
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import html from 'highlight.js/lib/languages/xml'
import { createLowlight } from 'lowlight'
import CodeBlockComponent from './CodeBlockComponent'

const lowlight = createLowlight()

lowlight.register('html', html)


const MenuBar = ({ editor, isEditingHtml, onToggleEditHtml }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          disabled={isEditingHtml}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button disabled={isEditingHtml} onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
          Left
        </button>
        <button disabled={isEditingHtml} onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
          Center
        </button>
        <button disabled={isEditingHtml} onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
          Right
        </button>
        <button disabled={isEditingHtml} onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
          Justify
        </button>
        <button onClick={onToggleEditHtml}>
          {isEditingHtml ? 'Visual Edit' : 'HTML Edit'}
        </button>
      </div>
    </div>
  )
}
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
      Image,
      CodeBlockLowlight
        .extend({
          addNodeView() {
            return ReactNodeViewRenderer(CodeBlockComponent)
          },
        })
        .configure({ lowlight }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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
    
    if (!isEditingHTML) {
      const code = editor.getHTML()
      // editor.commands.setContent(`<pre><code>${editor.getHTML()}</code></pre>`);
      editor.chain().setContent({
        type: 'codeBlock', 
        content: [{
          type: 'text',
          text: format(code, "\n\t"),
        }],
      }).run();
    } else {
      const json = editor.getJSON()
      console.log('===~json~===', '👀', json);
      editor.commands.setContent(editor.getText());

    }
    
    setIsEditingHTML(!isEditingHTML);
    return

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
        <MenuBar
          editor={editor}
          isEditingHtml={isEditingHTML}
          onToggleEditHtml={handleToggleHTMLMode}
        />
        <EditorContent editor={editor} />

        {/* {!isEditingHTML ? (
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
        )} */}
        <br />
      </div>
      {/* <div>
        <h3>html:</h3>
        <pre id="html-output">{html}</pre>
        <h3>isEditingHTML:</h3>
        <p>{String(isEditingHTML)}</p>
      </div> */}
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

      if (element.match( /^<?\w[^>]*[^\/]$/ ) && (!element.startsWith("input") || !element.startsWith("img") ) ) { 
          indent += tab;              
      }
  });

  return result.substring(1, result.length-3);
}