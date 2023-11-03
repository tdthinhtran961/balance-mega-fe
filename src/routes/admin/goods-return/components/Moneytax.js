import { taxApply } from "constants/index";
import React from "react"
const MoneyTax = ({ arrayProductlist, formatCurrency, pageType, filterTax }) => {
  const totalTaxPrice =
    arrayProductlist &&
    arrayProductlist
      .filter((item) => item.price !== undefined || item.quantityUnit !== undefined)
      .reduce((a, c) => {
        if (
          (pageType === 'create' && (!c.price || !c.quantityUnit)) ||
          (!c.basicUnit && pageType === 'edit' && (!c.price || !c.quantity)) ||
          (c.basicUnit && pageType === 'edit' && (!c.price || !c.quantityUnit))
        ) {
          return a;
        }
        return a + +c.price * (+c.quantityUnit || +c.quantity) * (+c?.tax / 100);
      }, 0);
  const totalPriceAfterTax =
    arrayProductlist &&
    arrayProductlist
      .filter((item) => item.price !== undefined || item.quantityUnit !== undefined)
      .reduce((a, c) => {
        if (
          (pageType === 'create' && (!c.price || !c.quantityUnit)) ||
          (!c.basicUnit && pageType === 'edit' && (!c.price || !c.quantity)) ||
          (c.basicUnit && pageType === 'edit' && (!c.price || !c.quantityUnit))
        ) {
          return a;
        }
        return a + +c.price * (+c.quantityUnit || +c.quantity) * (+c?.tax / 100 + 1);
      }, 0);
  const totalPrice =
    arrayProductlist &&
    arrayProductlist
      .filter((item) => item.price !== undefined || item.quantityUnit !== undefined)
      .reduce((a, c) => {
        if (
          (pageType === 'create' && (!c.price || !c.quantityUnit)) ||
          (!c.basicUnit && pageType === 'edit' && (!c.price || !c.quantity)) ||
          (c.basicUnit && pageType === 'edit' && (!c.price || !c.quantityUnit))
        ) {
          return a;
        }
        return a + +c.price * (+c.quantityUnit || +c.quantity);
      }, 0);
  return (
    <div
      className={`totalMoney-area ${totalPriceAfterTax > 99999999 ? 'w-[45%]' : 'w-[35%]'
        } flex flex-col ml-auto gap-2 mt-6 mb-[54px]`}
    >
      <div>
        <div className="flex justify-between mr-5 ">
          <span className="font-bold text-base text-teal-900 mr-11 sm:w-auto w-[150px]">Tổng tiền hàng:</span>
          <span className="font-bold text-base text-slate-700">
            {' '}
            {formatCurrency(totalPrice, ' VND')}{' '}
          </span>
        </div>
      </div>
      {filterTax === taxApply.APPLY ? <div>
        <div className="flex justify-between mr-5 ">
          <span className="font-bold text-base text-teal-900 mr-11 sm:w-auto w-[150px]">Tiền thuế:</span>
          <span className="font-bold text-base text-slate-700">
            {' '}
            {formatCurrency(totalTaxPrice, ' VND')}{' '}
          </span>
        </div>
      </div> : null}
      {filterTax === taxApply.APPLY ? <div>
        <div className="flex justify-between mr-5 ">
          <span className="font-bold text-base text-teal-900 mr-11 sm:w-auto w-[150px]">Tổng tiền sau thuế:</span>
          <span className="font-bold text-base text-slate-700">
            {' '}
            {formatCurrency(Math.round(totalPriceAfterTax), ' VND')}{' '}
          </span>
        </div>
      </div> : null}


    </div>
  )
}
export default MoneyTax
