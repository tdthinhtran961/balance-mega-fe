import { ColumnStoreDetailForm, ColumnBrandManagementDetail } from 'columns/store'
import { Form, Message } from 'components';
import React, { useEffect, useState } from 'react'
import { StoreService } from 'services/store';
import '../index.less'



function Address({ pageType,
  submit,
  data,
  form,
  emailManager,
  setManagerId,
  roleCode,
  isHidden,
  setIsHidden,
  connectKioViet,
  setConnectKioViet,
  pageBranch,
  ViewStoreBranch,
  isCall,
  setIsCall,
  isMain,
}) {

  const [address, setAddress] = useState({
    province: [],
    provinceCode: data?.provinceCode,
    district: [],
    districtCode: data?.districtCode,
    ward: []
  })

  const [listBranch, setListBranch] = useState([])

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const initFetchList = async () => {
      setLoading(true)
      try {
        if (isCall && (connectKioViet.client_id !== '' && connectKioViet.client_secret !== '' && connectKioViet.retailer !== '')) {
          const res = await StoreService.getListBranchNoNotice({ clientId: connectKioViet.client_id, clientSecret: connectKioViet.client_secret, retailer: connectKioViet.retailer })
          setListBranch(res.data)
        }
      } catch (error) {
        setIsCall(false)
        setLoading(false)
        return error
      } finally {
        setIsCall(false)
        setLoading(false)
      }
    }
    initFetchList()
  }, [isCall, connectKioViet])

  const isNullOrUndefinedOrEmpty = value => value === undefined || value === null || value === ''
  const handleConnectGetListBranches = async () => {
    if (isNullOrUndefinedOrEmpty(form.getFieldValue('client_id'))) return Message.error({ text: 'clientId là bắt buộc' })
    if (isNullOrUndefinedOrEmpty(form.getFieldValue('client_secret'))) return Message.error({ text: 'client_secret là bắt buộc' })
    if (isNullOrUndefinedOrEmpty(form.getFieldValue('retailer'))) return Message.error({ text: 'retailer là bắt buộc' })


    const res = await StoreService.getListBranch({ clientId: form.getFieldValue('client_id'), clientSecret: form.getFieldValue('client_secret'), retailer: form.getFieldValue('retailer') })
    res && setListBranch(res.data)
  }

  useEffect(() => {
    const getListProvince = async () => {
      const res = await StoreService.getListProvince();
      setAddress(prev => ({
        ...prev, province: res.data
      }))
    };
    getListProvince();
  }, []);

  useEffect(() => {
    const getListDistrict = async () => {
      if (address.provinceCode) {
        const res = await StoreService.getListDistrict(address.provinceCode);
        setAddress(prev => ({
          ...prev, district: res.data
        }))
      }
    };
    getListDistrict();
  }, [address.provinceCode, data]);

  useEffect(() => {
    const getListWard = async () => {
      if (address.districtCode) {
        const res = await StoreService.getListWard(address.districtCode);
        setAddress(prev => ({
          ...prev, ward: res.data
        }))
      }
    };
    getListWard();
  }, [address.districtCode]);
  return (
    <>
      <div>
        {pageBranch !== 'branch' ? (
          <div className="flex form-information">
            <Form
              className="w-full"
              columns={ColumnStoreDetailForm({
                pageType, emailManager, setManagerId,
                roleCode,
                address,
                setAddress,
                data,
                isHidden,
                setIsHidden,
                setConnectKioViet,
                listBranch,
                setListBranch,
                setIsCall,
                connectKioViet,
                isloading: loading,
                handleConnectGetListBranches
              })}
              handSubmit={submit}
              textSubmit={(data?.isActive === true) ? ((pageType === 'edit') ? 'Lưu' : pageType === 'information' ? 'Lưu' : null) : null}
              classGroupButton={`absolute justify-end items-end right-[20px] edit-store-btn mt-[30px] sm:mt-8 ${roleCode === 'ADMIN' ? '' : 'mt-[56px]'}`}
              values={data}
              form={form}
            />
          </div>
        ) : (
          <div>
            <div className="flex form-information">
              <Form
                className="w-full"
                columns={ColumnBrandManagementDetail({
                  pageType, emailManager, setManagerId,
                  roleCode,
                  address,
                  setAddress,
                  data,
                  isHidden,
                  setIsHidden,
                  setConnectKioViet,
                  listBranch,
                  ViewStoreBranch,
                  setListBranch,
                  setIsCall,
                  connectKioViet,
                })}
                handSubmit={submit}
                textSubmit={((pageType === 'edit' && (isMain || roleCode === 'ADMIN')) ? 'Lưu' : (ViewStoreBranch !== 'store' && (isMain || roleCode === 'ADMIN')) ? 'Lưu' : '')}
                classGroupButton={`absolute justify-end items-end sm:right-[35px] right-[18px]   ${(pageBranch === 'branch' && roleCode === 'ADMIN') ? 'edit-branch-btn' : 'edit-wstore-branch-btn'}  sm:mt-6 ${roleCode === 'ADMIN' ? '' : 'mt-[56px]'}`}
                values={data}
                form={form}
              />

            </div>
          </div>
        )}
      </div>
      {/* <div className='form-address-required sm:mb-6'>
        <p className="text-base mb-2 text-black">
          Địa chỉ cửa hàng {data?.isActive === false ? '' : <span className="text-[#ff4d4f] text-sm">*</span>}
        </p>
        {address?.province?.length > 0 &&
          <Form
            className="w-full"
            columns={ColumnStoreDetailAddressForm({
              pageType,
              roleCode,
              address,
              setAddress,
              data
            })}
            handSubmit={submit}
            textSubmit={data?.isActive === true ? (pageType === 'edit' ? 'Lưu' : pageType === 'information' ? 'Lưu' : null) : null}
            classGroupButton={`absolute justify-end items-end right-[20px] edit-store-btn ${roleCode === 'ADMIN' ? 'mt-[32px]' : 'mt-[56px]'}`}
            values={data}
            form={form}
            idSubmit="idAddress"
          />
        }
      </div>
      <div>
        <h3 className='text-lg text-teal-900 font-bold'>Kết nối KiotViet</h3>

      </div> */}
    </>
  )
}

export default Address
