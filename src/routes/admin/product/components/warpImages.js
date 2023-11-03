import React, { Fragment, useEffect, useState } from 'react';
import ImagesComponent from './image';
import classNames from 'classnames';
import { useAuth } from 'global';

const WrapImagesComponent = ({ canEdit = true, isUserSubmit = false, pageType }) => {
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const textClassName = 'text-center flex justify-center mt-4';
  // const imageSizeClass = 'md:h-16 md:min-w-[64px]';
  const imageSizeClass = 'lg:h-16 min-w-[64px] object-cover w-full';
  // const warpClassName = 'relative';
  const type = 'PRODUCT';

  const [mulImageUrl, setMulImageUrl] = useState([]);

  const [imageOneUrl, setImageOneUrl, ImageOneJsx] = ImagesComponent({
    warpClassName: 'm-auto',
    type,
    showText: true,
    removeIconClass: 'text-xl',
    canEdit,
    pageType,
    size: 'text-[3rem]',
    onlyImage: false,
    maxCount: 4,
    mulImageUrl: mulImageUrl,
    setMulImageUrl: setMulImageUrl,
  });
  const [imageTwoUrl, setImageTwoUrl, ImageTwoJsx] = ImagesComponent({
    warpClassName: 'relative md:mx-1 w-[32%]',
    textClassName,
    type,
    imageSizeClass,
    removeIconClass: 'text-base',
    canEdit,
    pageType,
  });
  const [imageThreeUrl, setImageThreeUrl, ImageThreeJsx] = ImagesComponent({
    warpClassName: 'relative md:mx-1 w-[32%]',
    type,
    imageSizeClass,
    textClassName,
    removeIconClass: 'text-base',
    canEdit,
    pageType,
  });
  const [imageFourUrl, setImageFourUrl, ImageFourJsx] = ImagesComponent({
    warpClassName: 'relative md:mx-1 w-[32%]',
    imageSizeClass,
    type,
    textClassName,
    removeIconClass: 'text-base',
    canEdit,
    pageType,
  });
  // const [imageFiveUrl, setImageFiveUrl,] = ImagesComponent({
  //   warpClassName,
  //   type,
  //   imageSizeClass,
  //   textClassName,
  //   removeIconClass: 'text-base',
  //   canEdit,

  // });

  useEffect(() => {
    setListImage(mulImageUrl.map((images, index) => ({ index: index, url: images })));
  }, [mulImageUrl]);

  useEffect(() => {
    if (pageType !== 'detail') {
      setMulImageUrl([imageOneUrl, imageTwoUrl, imageThreeUrl, imageFourUrl]);
    }
  }, [imageOneUrl, imageTwoUrl, imageThreeUrl, imageFourUrl]);

  const isListImageEmpty = () => ![imageOneUrl, imageTwoUrl, imageThreeUrl, imageFourUrl].filter(Boolean).length;
  const isListImageMain = () => ![imageOneUrl].filter(Boolean).length;

  const setListImage = (listImg = []) => {
    if (listImg.length === 0) {
      setImageOneUrl('');
      setImageTwoUrl('');
      setImageThreeUrl('');
      setImageFourUrl('');
      return;
    }
    listImg.forEach((ele, index, arr) => {
      if (ele.url !== '') {
        switch (index) {
          case 0:
            setImageOneUrl(ele.url);
            break;
          case 1:
            setImageTwoUrl(ele.url);
            break;
          case 2:
            setImageThreeUrl(ele.url);
            break;
          case 3:
            setImageFourUrl(ele.url);
            break;
          // case 4:
          //   setImageFiveUrl(ele.url);
          //   break;
          default:
            break;
        }
      }
    });
  };

  const imageCompArr = [
    { index: 1, url: imageTwoUrl, comp: ImageTwoJsx() },
    { index: 2, url: imageThreeUrl, comp: ImageThreeJsx() },
    { index: 3, url: imageFourUrl, comp: ImageFourJsx() },
  ];

  useEffect(() => {
    setTimeout(() => {
      import('glightbox').then(({ default: GLightbox }) => GLightbox());
    });
  }, []);

  return [
    setListImage,
    [imageOneUrl, imageTwoUrl, imageThreeUrl, imageFourUrl],
    () => (
      <div
        className={classNames('bg-white pr-2 rounded-xl relative warpProductImg', {
          'border border-1 border-red-500 ': isUserSubmit && isListImageEmpty(),
        })}
      >
        <div className="flex">{ImageOneJsx()}</div>
        {pageType === 'detail' ? (
          <div className="mt-4">
            <div className="flex justify-center gap-2">
              {imageCompArr.map((imageComp) => {
                setTimeout(() => {
                  import('glightbox').then(({ default: GLightbox }) => new GLightbox());
                });
                return <Fragment key={imageComp.index}>{imageComp.url !== '' && imageComp.comp}</Fragment>;
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex justify-center gap-1">
              {ImageTwoJsx()}
              {ImageThreeJsx()}
              {ImageFourJsx()}
            </div>
          </div>
        )}

        {isUserSubmit && isListImageEmpty() ? <p className="text-red-500 text-center"></p> : <></>}
        {/* {isUserSubmit && isListImageMain() ? <p className='text-red-500 text-center'>Sản phẩm phải có hình ảnh chính !!</p> : <></>} */}
        {roleCode !== 'OWNER_STORE' && pageType !== 'detail' && (
          <p className="text-gray-700 text-xs mx-auto text-center mt-2 px-2">
            Cho phép định dạng ảnh *.png, *.jpg và *.jpeg. Dung lượng ảnh tối đa 20MB
          </p>
        )}
      </div>
    ),
    isListImageMain,
  ];
};
export default WrapImagesComponent;
