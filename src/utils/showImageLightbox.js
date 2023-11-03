import axios from 'axios';

const Util = async (file) => {
  const response = await axios.get(file.response ? file.response.data.path : file.path, { responseType: 'blob' });
  const path = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
  if (file.type === 'jpg' || file.type === 'png') {
    import('glightbox').then(({ default: GLightbox }) =>{
      const myGallery = GLightbox({
        elements: [
          {
            href: path,
            type: 'image',
          },
        ],
        autoplayVideos: true,
      });
      myGallery.open();
    });
  } else {
    const link = document.createElement('a');
    link.href = path;
    link.target = '_blank';
    link.download = file.response ? file.response.data.fileName : file.name;
    link.click();
  }
};
export default Util;
