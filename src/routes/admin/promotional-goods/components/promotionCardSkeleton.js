import React from 'react';
import './skeleton.less';

const PromotionCardSkeleton = () => {
  return (
    <div className="cards">
      <div className="card is-loading">
        <div className="image"></div>
        <div className="content">
          <h2></h2>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default PromotionCardSkeleton;
