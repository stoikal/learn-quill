import { useState } from 'react';
import { EditorContent, useEditor, ReactNodeViewRenderer, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Code from '@tiptap/extension-code';
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import html from 'highlight.js/lib/languages/xml'
import { createLowlight } from 'lowlight'
import CodeBlockComponent from './CodeBlockComponent'

import {prettify, UserConfig} from "htmlfy"

const lowlight = createLowlight()

lowlight.register('html', html)

type MenuBarProps = {
  editor: Editor;
  isEditingHtml: boolean;
  onToggleEditHtml: () => void;
}


const MenuBar = ({ editor, isEditingHtml, onToggleEditHtml }: MenuBarProps) => {
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
    // onUpdate: ({ editor }) => {
    //   if (!isEditingHTML) { 
    //     const newHtml = editor.getHTML();
    //     setHtml(
    //       prettify(newHtml)
    //     );
    //   }
    // },
    
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
          text: prettify(code, { char: " ", count: 4 } as UserConfig),
        }],
      }).run();
    } else {
      editor.commands.setContent(editor.getText());

    }
    
    setIsEditingHTML(!isEditingHTML);
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
        <br />
      </div>
    </div>
  );
};


export default Tiptap;
