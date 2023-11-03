import React from 'react';

import { Editor } from 'components';

const Component = ({ value, onChange }) => {
  // const [isVisible, setIsVisible] = useState(false);

  // const onSelect = (newUrl) => {
  //   window.editorInsert(newUrl);
  //   // setIsVisible(false);
  // };
  // window.editorSetIsVisible = setIsVisible;

  return (
    <>
      <Editor value={value} config={defaultConfig} tabIndex={1} onBlur={onChange} />
      {/* <MediaManagement isVisible={isVisible} onSelect={onSelect} limit={1} onHide={() => setIsVisible(false)}/> */}
    </>
  );
};

const defaultConfig = {
  zIndex: 1,
  iframe: true,
  iframeCSSLinks: ['https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.css'],
  uploader: {
    insertImageAsBase64URI: true,
  },
  buttons:
    'source,fullsize,|,bold,italic,underline,paragraph,align,|,ul,ol,outdent,indent,hr,|,video,table,link,|,superscript,subscript,strikethrough,font,fontsize,brush,eraser',
  buttonsMD:
    'source,fullsize,|,bold,italic,underline,paragraph,align,|,ul,ol,outdent,indent,hr,|,video,table,link,|,dots',
  buttonsSM: 'source,fullsize,|,bold,italic,underline,paragraph,align,|,ul,ol,outdent,indent,hr,|,dots',
  buttonsXS: 'bold,italic,underline,paragraph,align,|,dots',
  toolbarButtonSize: 'small',
  // extraButtons: [
  //   {
  //     icon: 'image',
  //     tooltip: 'Image',
  //     popup: (editor, current, self, close) => {
  //       window.editorInsert = (src = "https://xdsoft.net/jodit/build/images/artio.jpg") => {
  //         editor.s.insertNode(
  //           editor.createInside.fromHTML(
  //             `<img style="width: 100%" src="${src}" alt="WeSports"/>`
  //           )
  //         );
  //       };
  //       window.editorSetIsVisible(true);
  //     }
  //   }
  // ],
  events: {},
};
export default Component;
