import { Tooltip } from 'antd';
import React, { useState } from 'react';
import noImage from 'assets/images/noimage.jpg';
const ReturnGoodCardImport = ({
  item,
  dataTempChoose,
  setDataTempChoose,
}) => {
  const [showTick, setShowTick] = useState(false);
  const handleChoose = async (choosingDisposalGoods) => {
    const indexChoosedDisposalGoods = dataTempChoose?.findIndex(
      (goods) => (goods.productId || goods.idProduct || goods.id) === choosingDisposalGoods.productId,
    );

    if (indexChoosedDisposalGoods !== -1) {
      dataTempChoose.splice(indexChoosedDisposalGoods, 1);
      setShowTick(false);
    } else {
      dataTempChoose.push({
        ...choosingDisposalGoods,
        check: true,
        orderLineItemId: +choosingDisposalGoods?.id,
        id: +choosingDisposalGoods?.productId
      });
      setShowTick(true);
    }
    setDataTempChoose(dataTempChoose);
  };

  return (
    <div
      className={`card-item bg-white rounded-[10px] shadow-xl hover:bg-gray-100 transition-all cursor-pointer relative h-[200px] text-center`}
      onClick={() => handleChoose(item)}
    >
      <div className="flex flex-col justify-center items-center pt-[10px]" style={{ height: 'fit-content' }}>
        <div className="">
          <img
            className="object-cover rounded-md w-[130px]"
            style={{ aspectRatio: '1/1' }}
            src={item?.photos?.[0]}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = noImage;
            }}
            alt={item?.name}
          />
        </div>
        <Tooltip placement="topLeft" title={item?.name} mouseEnterDelay={0.1} mouseLeaveDelay={0.1}>
          <p className="max-w-[75%] text-ellipsis overflow-hidden whitespace-nowrap text-base text-teal-900 font-medium mt-2">
            {item?.name}
          </p>
        </Tooltip>
        <Tooltip placement="topLeft" title={item?.subOrg?.name} mouseEnterDelay={0.1} mouseLeaveDelay={0.2}>
          <p className="max-w-[90%] text-ellipsis overflow-hidden whitespace-nowrap text-sm font-normal text-gray-600 mb-1">
            {item?.subOrg?.name}
          </p>
        </Tooltip>

        {showTick ? (
          <svg
            className="absolute top-[10px] right-[13px]"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="16" height="16" fill="#2563EB" />
            <path
              d="M12.2064 4.79279C12.3939 4.98031 12.4992 5.23462 12.4992 5.49979C12.4992 5.76495 12.3939 6.01926 12.2064 6.20679L7.20643 11.2068C7.0189 11.3943 6.76459 11.4996 6.49943 11.4996C6.23427 11.4996 5.97996 11.3943 5.79243 11.2068L3.79243 9.20679C3.61027 9.01818 3.50948 8.76558 3.51176 8.50339C3.51403 8.24119 3.6192 7.99038 3.80461 7.80497C3.99002 7.61956 4.24083 7.51439 4.50303 7.51211C4.76523 7.50983 5.01783 7.61063 5.20643 7.79279L6.49943 9.08579L10.7924 4.79279C10.98 4.60532 11.2343 4.5 11.4994 4.5C11.7646 4.5 12.0189 4.60532 12.2064 4.79279Z"
              fill="white"
            />
          </svg>
        ) : (
          <svg
            className="absolute top-[10px] right-[13px]"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.5 0.5H15.5V15.5H0.5V0.5Z" fill="white" stroke="#6B7280" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default ReturnGoodCardImport;
