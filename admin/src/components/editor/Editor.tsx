'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Quote, 
  Highlighter, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Video, 
  List, 
  ListOrdered,
  Paintbrush,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { useCallback } from 'react';

interface EditorProps {
  content: any;
  onChange: (content: any) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt('Enter YouTube URL:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);
    
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // Pre-defined color options for text color
  const textColors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Green', value: '#10b981' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'White', value: '#ffffff' },
    { name: 'Reset', value: '' }
  ];

  // Pre-defined highlight backgrounds
  const highlightColors = [
    { name: 'Red', value: '#fef2f2' }, // Red bg
    { name: 'Yellow', value: '#fef9c3' }, // Yellow bg
    { name: 'Green', value: '#f0fdf4' }, // Green bg
    { name: 'Blue', value: '#eff6ff' }, // Blue bg
    { name: 'Reset', value: '' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-surface border-b border-border rounded-t-xl sticky top-0 z-10">
      
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-accent/20 text-accent font-bold' : 'text-text hover:bg-background'}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-accent/20 text-accent' : 'text-text hover:bg-background'}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-accent/20 text-accent' : 'text-text hover:bg-background'}`}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      {/* Strikethrough */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('strike') ? 'bg-accent/20 text-accent' : 'text-text hover:bg-background'}`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Heading 2 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg transition-colors font-bold text-xs ${editor.isActive('heading', { level: 2 }) ? 'bg-accent/20 text-accent' : 'text-text hover:bg-background'}`}
        title="Heading 2"
      >
        H2
      </button>

      {/* Heading 3 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-lg transition-colors font-bold text-xs ${editor.isActive('heading', { level: 3 }) ? 'bg-accent/20 text-accent' : 'text-text hover:bg-background'}`}
        title="Heading 3"
      >
        H3
      </button>

      {/* Quote */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-accent/20 text-accent' : 'text-text hover:bg-background'}`}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-accent/20 text-accent' : 'text-text hover:bg-background'}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      {/* Ordered List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-accent/20 text-accent' : 'text-text hover:bg-background'}`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Color Picker Selector */}
      <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-background/50" title="Text Color">
        <Paintbrush className="w-3.5 h-3.5 text-text-muted ml-1.5" />
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') {
              editor.chain().focus().unsetColor().run();
            } else {
              editor.chain().focus().setColor(val).run();
            }
          }}
          className="bg-transparent text-[10px] font-bold text-text focus:outline-none cursor-pointer pr-1"
          defaultValue=""
        >
          <option value="" className="bg-surface text-text">Color</option>
          {textColors.map((c) => (
            <option key={c.name} value={c.value} className="bg-surface text-text" style={{ color: c.value }}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Highlight Background Picker Selector */}
      <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-background/50" title="Highlight Color">
        <Highlighter className="w-3.5 h-3.5 text-text-muted ml-1.5" />
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') {
              editor.chain().focus().unsetHighlight().run();
            } else {
              editor.chain().focus().toggleHighlight({ color: val }).run();
            }
          }}
          className="bg-transparent text-[10px] font-bold text-text focus:outline-none cursor-pointer pr-1"
          defaultValue=""
        >
          <option value="" className="bg-surface text-text">Highlight</option>
          {highlightColors.map((h) => (
            <option key={h.name} value={h.value} className="bg-surface text-text">
              {h.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Link */}
      <button 
        type="button"
        onClick={setLink} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-accent/20 text-accent' : 'text-text hover:bg-background'}`}
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>

      {/* Image */}
      <button 
        type="button"
        onClick={addImage} 
        className="p-2 rounded-lg transition-colors text-text hover:bg-background"
        title="Insert Image (Link)"
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      {/* YouTube Video */}
      <button 
        type="button"
        onClick={addYoutube} 
        className="p-2 rounded-lg transition-colors text-text hover:bg-background"
        title="Insert Video"
      >
        <Video className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function AdvancedEditor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl max-w-full my-6 border border-border shadow-md mx-auto block' } }),
      Youtube.configure({ HTMLAttributes: { class: 'w-full aspect-video rounded-xl my-6 border border-border shadow-md' } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-accent underline underline-offset-4 decoration-accent/50 hover:decoration-accent transition-all' } }),
      UnderlineExtension,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: 'Start writing your investigation...' }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert prose-headings:font-playfair prose-headings:font-bold prose-p:font-inter prose-a:text-accent focus:outline-none min-h-[500px] py-6 px-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="border border-border rounded-xl bg-background overflow-hidden focus-within:ring-2 focus-within:ring-accent/50 transition-all">
      <MenuBar editor={editor} />
      <div className="px-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
