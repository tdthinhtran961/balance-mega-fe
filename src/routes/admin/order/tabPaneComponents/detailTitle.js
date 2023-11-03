import React from 'react';
import { exportSvg } from 'utils/exportSvg';
// import { formatCurrency } from "utils"

const DetailTitle = ({ roleCode, status, tabKey, data, view, formatTime }) => {
  const addDescription = (description) => {
    return description ? (
      <div className="flex gap-3 ml-4">
        {exportSvg('PROMOTION')}
        <span className="text-green-600 w-fit">{description}</span>
      </div>
    ) : null;
  };
  const convertText = (value) => {
    if (!value) {
      return '';
    }
    return value;
  };
  return (
    <>
      {roleCode === 'OWNER_STORE' && (
        <>
          <div className="w-full flex flex-col md:flex-row text-base">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                <div className="font-bold text-black order">Mã đơn hàng:</div>
                <div className="text-gray-500">{data.code}</div>
              </div>
              {+tabKey !== 2 && +tabKey !== 4 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Nhà cung cấp:</div>
                  <div className="text-gray-500">{data?.supplier?.name}</div>
                </div>
              )}
              {+tabKey !== 1 && +tabKey !== 2 && +tabKey !== 3 && +tabKey !== 4 && +tabKey !== 5 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Tên cửa hàng:</div>
                  <div className="text-gray-500">{data?.store?.name}</div>
                </div>
              )}
              {+tabKey === 4 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian nhận hàng:</div>
                  <div className="text-gray-500">{formatTime(data?.deliveredAt)}</div>
                </div>
              )}
              {+tabKey === 4 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section text-base">
                  <div className="font-bold text-black order flex-none">Địa chỉ giao hàng:</div>
                  <div className="text-gray-500">{data?.addressConvert}</div>
                </div>
              )}
              {+tabKey === 3 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian lấy hàng:</div>
                  <div className="text-gray-500">{formatTime(data?.pickupAt)}</div>
                </div>
              )}
              {+tabKey === 2 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian xác nhận:</div>
                  <div className="text-gray-500">{formatTime(data?.confirmAt)}</div>
                </div>
              )}
            </div>
            <div className="w-full">
              {+tabKey === 1 ||
                (+tabKey === 5 && (
                  <div className="w-full flex flex-row mb-5 gap-3 detail-order-section hidden md:opacity-0  hidden-order-detail-field">
                    <div className="font-bold text-black order">Trạng thái:</div>
                    {status === 'DELIVERY_RECEIVE' ? (
                      <div>{'Chưa nhận'}</div>
                    ) : status === 'DELIVERY_RECEIVED' ? (
                      <div className="text-gray-500">{'Đã nhận đủ'}</div>
                    ) : (
                      <div className="text-gray-500">{'Đã nhận một phần'}</div>
                    )}
                  </div>
                ))}
              {+tabKey === 4 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Mã nhập hàng:</div>
                  <div className="text-gray-500">{data?.oderInvoiceCode}</div>
                </div>
              )}
              {+tabKey === 2 ||
                (+tabKey === 4 && (
                  <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                    <div className="font-bold text-black order">Nhà cung cấp:</div>
                    <div className="text-gray-500">{data?.supplier?.name}</div>
                  </div>
                ))}
              {+tabKey !== 2 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian đặt hàng: </div>
                  <div className="text-gray-500">{formatTime(data?.createdAt)}</div>
                </div>
              )}
              {+tabKey !== 1 && +tabKey !== 2 && +tabKey !== 4 && +tabKey !== 5 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Trạng thái:</div>
                  {status === 'DELIVERY_RECEIVE' ? (
                    <div>{'Chưa nhận'}</div>
                  ) : status === 'DELIVERY_RECEIVED' ? (
                    <div className="text-gray-500">{'Đã nhận đủ'}</div>
                  ) : (
                    <div className="text-gray-500">{'Đã nhận một phần'}</div>
                  )}
                </div>
              )}
              {+tabKey === 2 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Nhà cung cấp:</div>
                  <div className="text-gray-500">{data?.supplier?.name}</div>
                </div>
              )}
              {+tabKey === 2 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian đặt hàng:</div>
                  <div className="text-gray-500">{formatTime(data?.createdAt)}</div>
                </div>
              )}

              {+tabKey !== 1 && +tabKey !== 2 && +tabKey !== 3 && +tabKey !== 4 && +tabKey !== 5 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Số điện thoại:</div>
                  <div className="text-gray-500">{data?.storeAdmin?.phoneNumber}</div>
                </div>
              )}
              {/* {+tabKey === 1 && (
                <div className="w-full mb-5 gap-3 opacity-0 hidden md:inline-block">
                  <div className="font-bold text-black order">Thời gian đặt hàng: </div>
                </div>
              )} */}
              {/* {+tabKey !== 2 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian đặt hàng: </div>
                  <div className="text-gray-500">{formatTime(data?.createdAt)}</div>
                </div>
              )} */}
              {(+tabKey === 1 || +tabKey === 3 || +tabKey === 4 || +tabKey === 5) && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <span className="font-bold text-black order text-base">Vouchers:</span>
                  <span className="flex flex-col sm:flex-row text-base">
                    {convertText(data?.voucher?.code)} {addDescription(convertText(data?.voucher?.description))}
                  </span>
                </div>
              )}

              {+tabKey !== 1 ||
                +tabKey !== 2 ||
                (+tabKey !== 3 && (
                  <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                    <div className="font-bold text-black order">Nhà cung cấp:</div>
                    <div className="text-gray-500">{data?.supplier?.name}</div>
                  </div>
                ))}
            </div>
          </div>
          {+tabKey === 2 && (
            <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
              <span className="font-bold text-black order text-base">Vouchers:</span>
              <span className="flex flex-col sm:flex-row text-base">
                {convertText(data?.voucher?.code)} {addDescription(convertText(data?.voucher?.description))}
              </span>
            </div>
          )}
          {+tabKey !== 4 && (
            <div className={status === 'DELIVERED' ? 'flex' : ''}>
              <div className="w-full flex flex-row mb-5 gap-3 detail-order-section text-base">
                <div className="font-bold text-black order flex-none">Địa chỉ giao hàng:</div>
                <div className="text-gray-500">{data?.addressConvert}</div>
              </div>
            </div>
          )}
        </>
      )}
      {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && (
        <>
          <div className="w-full flex flex-col lg:flex-row text-base">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                <div className="font-bold text-black order">Mã đơn hàng:</div>
                <div className="text-gray-500">{data.code}</div>
              </div>
              {+tabKey !== 2 && +tabKey !== 4 && +tabKey !== 1 && +tabKey !== 3 && +tabKey !== 5 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Nhà cung cấp:</div>
                  <div className="text-gray-500">{data?.supplier?.name}</div>
                </div>
              )}
              {+tabKey === 5 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Tên cửa hàng:</div>
                  <div className="text-gray-500">{data?.store?.name}</div>
                </div>
              )}
              {+tabKey === 1 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Tên cửa hàng:</div>
                  <div className="text-gray-500">{data?.store?.name}</div>
                </div>
              )}

              {+tabKey === 4 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian nhận hàng:</div>
                  <div className="text-gray-500">{formatTime(data?.deliveredAt)}</div>
                </div>
              )}
              {+tabKey === 3 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Tên cửa hàng:</div>
                  <div className="text-gray-500">{data?.store?.name}</div>
                </div>
              )}
              {+tabKey === 2 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian xác Nhận:</div>
                  <div className="text-gray-500">{formatTime(data?.confirmAt)}</div>
                </div>
              )}
            </div>
            <div className="w-full">
              {+tabKey === 1 ||
                (+tabKey === 5 && (
                  <div className="w-full flex flex-row mb-5 gap-3 detail-order-section hidden md:opacity-0 hidden-order-detail-field ">
                    <div className="font-bold text-black order">Trạng thái:</div>
                    {status === 'DELIVERY_RECEIVE' ? (
                      <div>{'Chưa nhận'}</div>
                    ) : status === 'DELIVERY_RECEIVED' ? (
                      <div className="text-gray-500">{'Đã nhận đủ'}</div>
                    ) : (
                      <div className="text-gray-500">{'Đã nhận một phần'}</div>
                    )}
                  </div>
                ))}
              {+tabKey === 4 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Tên cửa hàng:</div>
                  <div className="text-gray-500">{data?.store?.name}</div>
                </div>
              )}

              {+tabKey !== 1 && +tabKey !== 2 && +tabKey !== 4 && +tabKey !== 5 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Trạng thái:</div>
                  {status === 'DELIVERY_RECEIVE' ? (
                    <div>{'Chưa nhận'}</div>
                  ) : status === 'DELIVERY_RECEIVED' ? (
                    <div className="text-gray-500">{'Đã nhận đủ'}</div>
                  ) : (
                    <div className="text-gray-500">{'Đã nhận một phần'}</div>
                  )}
                </div>
              )}
              {+tabKey === 2 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Tên cửa hàng:</div>
                  <div className="text-gray-500">{data?.store?.name}</div>
                </div>
              )}
              {+tabKey === 2 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian đặt hàng:</div>
                  <div className="text-gray-500">{formatTime(data?.createdAt)}</div>
                </div>
              )}

              {+tabKey !== 1 && +tabKey !== 2 && +tabKey !== 3 && +tabKey !== 4 && +tabKey !== 5 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Số điện thoại:</div>
                  <div className="text-gray-500">{data?.storeAdmin?.phoneNumber}</div>
                </div>
              )}
              {/* {+tabKey === 1 && (
                <div className="w-full mb-5 gap-3 opacity-0 hidden md:inline-block">
                  <div className="font-bold text-black order">Thời gian đặt hàng:</div>
                </div>
              )} */}
              {+tabKey !== 2 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian đặt hàng:</div>
                  <div className="text-gray-500">{formatTime(data?.createdAt)}</div>
                </div>
              )}

              {+tabKey !== 1 ||
                +tabKey !== 2 ||
                (+tabKey !== 3 && (
                  <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                    <div className="font-bold text-black order">Nhà cung cấp:</div>
                    <div className="text-gray-500">{data?.supplier?.name}</div>
                  </div>
                ))}
              {(+tabKey === 1 || +tabKey === 5) && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <span className="font-bold text-black order text-base">Vouchers:</span>
                  <span className="flex flex-col sm:flex-row text-base">
                    {convertText(data?.voucher?.code)} {addDescription(convertText(data?.voucher?.description))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {(+tabKey === 2 || +tabKey === 3 || +tabKey === 4) && (
            <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
              <span className="font-bold text-black order text-base">Vouchers:</span>
              <span className="flex flex-col sm:flex-row text-base">
                {convertText(data?.voucher?.code)} {addDescription(convertText(data?.voucher?.description))}
              </span>
            </div>
          )}
          <div className={status === 'DELIVERED' ? 'flex' : ''}>
            <div className="w-full flex flex-row mb-5 gap-3 detail-order-section text-base">
              <div className="font-bold text-black order flex-none">Địa chỉ giao hàng:</div>
              <div className="text-gray-500">{data?.addressConvert}</div>
            </div>
          </div>
        </>
      )}
      {roleCode === 'ADMIN' && (
        <>
          <div className="w-full flex flex-col md:flex-row text-base">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                <div className="font-bold text-black order">Mã đơn hàng:</div>
                <div className="text-gray-500">{data.code}</div>
              </div>
              {(data?.status === 'DELIVERY_RECEIVED' ||
                data?.status === 'CANCELLED' ||
                data?.status === 'DELIVERED') && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian đặt hàng:</div>
                  <div className="text-gray-500">{formatTime(data?.createdAt)}</div>
                </div>
              )}
              <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                <div className="font-bold text-black order">Tên cửa hàng:</div>
                <div className="text-gray-500">{data?.store?.name}</div>
              </div>
              {+tabKey === 4 && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order flex-none">Địa chỉ giao hàng:</div>
                  <div className="text-gray-500">{data?.addressConvert}</div>
                </div>
              )}
            </div>
            <div className="w-full">
              {data?.status === 'DELIVERY_RECEIVED' && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Trạng thái:</div>
                  {status === 'DELIVERY_RECEIVE' ? (
                    <div>{'Chưa nhận'}</div>
                  ) : status === 'DELIVERY_RECEIVED' ? (
                    <div className="text-gray-500">{'Đã nhận đủ'}</div>
                  ) : (
                    <div className="text-gray-500">{'Đã nhận một phần'}</div>
                  )}
                </div>
              )}
              {data?.status === 'DELIVERED' && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Mã nhập hàng:</div>
                  <div className="text-gray-500">{data?.oderInvoiceCode}</div>
                </div>
              )}
              {data?.status === 'CANCELLED' && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section opacity-0">
                  <div className="font-bold text-black order">Mã nhập hàng:</div>
                  <div className="text-gray-500">{data?.oderInvoiceCode}</div>
                </div>
              )}
              {data?.status === 'WAITING_APPROVED' && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian đặt hàng:</div>
                  <div className="text-gray-500">{formatTime(data?.createdAt)}</div>
                </div>
              )}
              {(data?.status === 'WAITING_PICKUP' || data?.status === 'DELIVERED') && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <div className="font-bold text-black order">Thời gian xác nhận:</div>
                  <div className="text-gray-500">{formatTime(data?.confirmAt)}</div>
                </div>
              )}
              {(data?.status === 'DELIVERY_RECEIVED' || data?.status === 'CANCELLED') && (
                <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                  <span className="font-bold text-black order text-base">Vouchers:</span>
                  <span className="flex flex-col sm:flex-row text-base">
                    {convertText(data?.voucher?.code)} {addDescription(convertText(data?.voucher?.description))}
                  </span>
                </div>
              )}
              <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                <div className="font-bold text-black order">Nhà cung cấp:</div>
                <div className="text-gray-500">{data?.supplier?.name}</div>
              </div>
            </div>
          </div>
          {(data?.status === 'WAITING_APPROVED' ||
            data?.status === 'WAITING_PICKUP' ||
            data?.status === 'DELIVERED') && (
            <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
              <span className="font-bold text-black order text-base">Vouchers:</span>
              <span className="flex flex-col sm:flex-row text-base">
                {convertText(data?.voucher?.code)} {addDescription(convertText(data?.voucher?.description))}
              </span>
            </div>
          )}

          {+tabKey !== 4 && (
            <div className={status === 'DELIVERED' ? 'flex' : ''}>
              <div className="w-full sm:flex flex-row mb-5 gap-3 text-base">
                <div className="font-bold text-black order flex-none">Địa chỉ giao hàng:</div>
                <div className="text-gray-500">{data?.addressConvert}</div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default DetailTitle;
