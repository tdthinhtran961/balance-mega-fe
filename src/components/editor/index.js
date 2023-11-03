import React, { useEffect, useRef, forwardRef, useLayoutEffect } from 'react';

const Editor = forwardRef(({ config, id, name, onBlur, onChange, tabIndex, value, editorRef }, ref) => {
  const textArea = useRef(null);

  useLayoutEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(textArea.current);
      } else {
        ref.current = textArea.current;
      }
    }
  }, [textArea, ref]);

  useEffect(() => {
    import('jodit').then(({ Jodit }) => {
      const element = textArea.current;
      textArea.current = Jodit.make(element, config);
      textArea.current.workplace.tabIndex = tabIndex || -1;

      // adding event handlers
      textArea.current.events.on('blur', (value) => onBlur && onBlur(textArea?.current?.value));
      textArea.current.events.on('change', (value) => onChange && onChange(value));

      if (id) element.id = id;
      if (name) element.name = name;

      if (typeof editorRef === 'function') {
        editorRef(textArea.current);
      }

      return () => {
        textArea.current?.destruct();
        textArea.current = element;
      };
    });
  }, [config, editorRef, id, name, onBlur, onChange, tabIndex]);

  useEffect(() => {
    if (textArea?.current?.value !== value) {
      textArea.current.value = value;
    }
  }, [value]);

  return <textarea ref={textArea} />;
});
Editor.displayName = 'Search';
export default Editor;
