import React, { useEffect, useState } from "react"
import './index.less'
import NoImage from '../../../../assets/images/no-image.jpg'
function ProductImage({ images }) {
  const [main,] = useState(images && images?.filter(item => item?.isCover === true)?.[0] || NoImage)
  useEffect(() => {
    setTimeout(() => {
      import('glightbox').then(({ default: GLightbox }) => GLightbox());
    });
  }, []);
  return (
    <section className="productimage__container">
      <div className="overflow-hidden rounded-xl">
        <a href={main?.url || NoImage} className="glightbox">
          <img
            src={main?.url || NoImage}
            alt={main?.id}
            className="block lg:h-[224px] h-[250px] lg:w-full md:w-[40%] m-auto lg:object-cover "
          />
        </a>
      </div>
      <div className="gallery">
        {images?.filter(item => item?.isCover === false && item?.url !== '')?.slice(0, 3).map((image, index) => {
          return (
            <a href={image?.url} className="glightbox" key={index}>
              <img
                src={image?.url}
                alt="image"
                className={`${image.url === main.url ? "active" : " "}` + "bShadow object-cover"}
              />
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default React.memo(ProductImage)
