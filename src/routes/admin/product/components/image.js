import React, { useState, useEffect, useRef } from 'react';
import { Message, Spin, Upload } from 'components';
import { UtilService } from 'services/util';
import '../index.less';
import classNames from 'classnames';

// import GLightbox from 'glightbox';

const ImagesComponent = ({
  warpClassName = 'relative',
  type = 'CATEGORY',
  // textClassName = 'md:mt-20',
  textClassName = 'mt-20',
  // imageSizeClass = 'md:h-52 md:w-52 !rounded-2xl sm:h-52 sm:w-52',
  imageSizeClass = '!rounded-2xl h-52 w-52 aspect-square object-cover',
  showText = false,
  removeIconClass = 'text-base',
  canEdit = true,
  size,
  pageType,
  maxCount,
  onlyImage = true,
  setMulImageUrl = null,
}) => {
  const indexFile = useRef(0);
  const [imageUrl, setImageUrl] = useState('');
  const removeImg = () => {
    setImageUrl('');
  };

  useEffect(() => {
    // setTimeout(() => {
    import('glightbox').then(({ default: GLightbox }) => new GLightbox());
    // });
  }, []);

  return [
    imageUrl,
    setImageUrl,
    () => (
      <div className={warpClassName}>
        {!imageUrl ? (
          <div>

            {canEdit ? (
              <>
                <Upload
                  onChange={(file) => {

                  }}
                  onlyImage={onlyImage}
                  maxSize={20}
                  indexFile={indexFile}
                  isProduct={true}
                  action={async (file) => {
                    // console.log('file: ', file);
                    const isLt25M = file.size / 1024 / 1024 < 25;
                    if (!isLt25M) {
                      Message.error({ text: 'Hình ảnh có kích thước nhỏ hơn 25MB!' });
                      return;
                    }
                    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                      return Message.error({
                        text: 'Định dạng file không hợp lệ. Vui lòng chỉ tải lên file ảnh có định dạng jpg/jpeg/png.',
                      });
                    }
                    const urlArr = await UtilService.post(file, type);
                    if (indexFile.current > maxCount) {
                      return;
                    }
                    if (indexFile.current === maxCount) {
                      indexFile.current++;
                      return Message.error({ text: `Vui lòng chỉ tải tối đa ${maxCount} hình ảnh cho mỗi sản phẩm` });
                    }
                    if (!onlyImage) {
                      setMulImageUrl(pre => {
                        const result = pre.map((img, index) => {
                          return index === indexFile.current ? urlArr[0] : img;
                        });
                        return result;
                      })
                    } else {
                      setImageUrl(urlArr[0] ?? '');
                    }
                    indexFile.current++;
                  }}
                >
                  <div className={'cursor-pointer border border-dashed border-gray-500 rounded-xl ' + imageSizeClass}>
                    <div className={'text-center ' + textClassName}>
                      <i className={`las la-image text-2xl + ${size}`}></i>
                      {showText ? (
                        <p className="text-xs text-gray-700 ">
                          <span className="">Tải ảnh lên từ thiết bị</span>
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </Upload>
                <i className="las la-upload absolute icon-upload top-1/2 left-1/2 hidden text-4xl -translate-x-2/4 -translate-y-2/4 "></i>
              </>
            ) : (
              <div className={'border border-dashed border-gray-500 rounded-xl ' + imageSizeClass}>
                <div className={'text-center ' + textClassName}>
                  <i className="las la-image text-2xl"></i>
                  {showText ? (
                    <p className="text-xs text-gray-700 ">
                      <span className="">Tải ảnh từ thiết bị</span>
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {pageType !== 'detail' ? (
              <div>
                {!imageUrl ? (
                  <Spin text={'Đang tải ...'} />
                ) : (
                  <div
                    className={classNames('bg-cover bg-center rounded-[10px]', imageSizeClass, {
                      canEdit: 'cursor-pointer ',
                    })}
                    style={{ backgroundImage: 'url(' +  JSON.stringify(imageUrl) + ')' }}
                  >
                    <div className="flex justify-end">
                      {canEdit ? (
                        <i
                          className={'las la-times text-right hover:scale-150 ' + removeIconClass}
                          onClick={() => removeImg()}
                        ></i>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <a href={imageUrl} className="z-1 relative glightbox">
                  <img src={imageUrl} alt="image" className={'' + imageSizeClass} />
                </a>
              </div>
            )}
          </>

          // <div className='relative'>
          //   <a href={imageUrl} className="glightbox">
          //     <img src={imageUrl} alt="image" className={'' + imageSizeClass} />
          //   </a>
          //   <div className="flex justify-end z-50 absolute right-0 top-0">
          //     {canEdit ? <i
          //       className={'las la-times text-right  hover:scale-150 ' + removeIconClass}
          //       onClick={() => removeImg()}
          //     ></i> : null}

          //   </div>
          // </div>
        )}
      </div>
    ),
  ];
};
export default ImagesComponent;
