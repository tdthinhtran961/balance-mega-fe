
import { routerLinks } from 'utils';
const { ProductService } = require('services/product');

export const isNullOrUndefined = (value) => value === null || value === undefined
export const isNullOrUndefinedOrEmpty = (value) => value === null || value === undefined || value === ''
export const isEmpty = (value) => value === ''

export const cancel = async (id, navigate) =>
  import('sweetalert2').then(({ default: Swal }) =>
    Swal.fire({
      // title: 'Thông báo',
      html: `
        <div class="popup-tt">
              <h1 class="text-[2.5rem] font-bold mt-10 mb-5 ">Thông báo</h1>
              <p class="mb-5">Bạn có chắc muốn từ chối phê duyệt sản phẩm này?</p>
              <div class="flex wrapper w-full flex-col">
              <label for="reason" class="label_reason w-[50px]">
                Lý do
              </label>
              <select id="reason" class="w-full h-10 text-gray-600 bg-white pr-9 pl-4 ant-input rounded-xl">
                <option value="Đơn vị cơ bản không đúng">Đơn vị cơ bản không đúng</option>
                <option value="Danh mục sản phẩm không đúng">Danh mục sản phẩm không đúng</option>
                <option value="Mô tả sản phẩm không phù hợp">Mô tả sản phẩm không phù hợp</option>
                <option value="Bảng giá cho cửa hàng không phù hợp">Bảng giá cho cửa hàng không phù hợp</option>
                <option value="Chiết khẩu với BALANCE không hợp lý">Chiết khẩu với BALANCE không hợp lý</option>
                <option value="other" selected>Khác</option>
              </select>
              <div id="alert" class="ant-form-item-explain-error text-left" style="display: none">Xin vui lòng chọn lý do</div>
              </div>
              <textarea id="content" class="ant-input px-4 py-3 w-full rounded-xl text-gray-600 bg-white border border-solid text-sm h-[200px]" style="display: none" placeholder="Vui lòng nhập lý do của bạn"></textarea>
              <div id="alert-content" class="text-red-500 text-base text-left" style="display: none" >Hãy điền lý do của bạn !</div> </div>`,
      showConfirmButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#134E4A',
      width: 580,
      willOpen: () => {
        const input1 = document.getElementById('reason');
        const input2 = document.getElementById('content');
        if (input1.value && input1.value === 'other') {
          input2.style.display = 'block';
        } else {
          input2.style.display = 'none';
        }
      },
      didOpen: () => {
        const input1 = document.getElementById('reason');
        const input2 = document.getElementById('content');
        const message = document.getElementById('alert');
        const alertContent = document.getElementById('alert-content');

        input1.oninput = () => {
          if (message.style.display === 'block') message.style.display = 'none';
          // input1.setAttribute('style', 'border:none;');
          if (input1.value === 'other') {
            input2.style.display = 'block';
          } else {
            input2.removeAttribute('style');
            input2.style.display = 'none';
            alertContent.style.display = 'none';
          }
        };
        input2.oninput = () => {
          if (input2.value || input2.value.trim().length > 0) {
            alertContent.style.display = 'none';
            input2.removeAttribute('style');
            return true;
          }
        };
      },
      preConfirm: async () => {
        const input1 = document.getElementById('reason');
        const message = document.getElementById('alert');
        const otherReasonContent = document.getElementById('content');
        const alertContent = document.getElementById('alert-content');
        if (!input1.value || input1.value.trim().length === 0) {
          message.style.display = 'block';
          input1.focus();
          input1.setAttribute('style', 'border-color: #ff4d4f');
          return false;
        }
        if ((!otherReasonContent.value || otherReasonContent.value.trim().length === 0) && input1.value === 'other') {
          alertContent.style.display = 'block';
          otherReasonContent.focus();
          otherReasonContent.setAttribute('style', 'border-color: #ff4d4f');
          return false;
        }

        const res = await ProductService.rejectProduct(id, {
          rejectReason: document.getElementById('content').value || document.getElementById('reason').value,
        })
        if (res) {
          navigate(`${routerLinks('Product')}?tab=2`);
        }
      },
    }),
  );

export const handleReject = async (id, navigate) => {
  import('sweetalert2').then(({ default: Swal }) =>
    Swal.fire({
      icon: 'warning',
      title: 'Thông báo',
      text: 'Bạn có chắc muốn từ chối sản phẩm này?',
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Đồng ý',
      confirmButtonColor: '#134E4A',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
      preConfirm: async () => {
        await cancel(id, navigate)
      },
    }),
  );
};
export const deleteProduct = async (id, navigate, type = 'BALANCE') => {
  import('sweetalert2').then(({ default: Swal }) =>
    Swal.fire({
      icon: 'warning',
      title: 'Thông báo',
      text: 'Bạn có chắc chắn xóa sản phẩm này? Khi thực hiện hành động xóa, sản phẩm sẽ bị xóa khỏi hệ thống và không hoàn tác được',
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Đồng ý',
      confirmButtonColor: '#DC2626',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
      preConfirm: async () => {
        const res = await ProductService.delete([id]);
        if(res){
          return type === 'BALANCE' ? navigate(`${routerLinks('Product')}`) : navigate(`${routerLinks('Product')}?tab=2`);
        }
      },
    }),
  );
};
export const deleteProductStore = async (id, navigate) => {
  import('sweetalert2').then(({ default: Swal }) =>
    Swal.fire({
      icon: 'warning',
      title: 'Thông báo',
      text: 'Bạn có chắc chắn xóa sản phẩm này? Khi thực hiện hành động xóa, sản phẩm sẽ bị xóa khỏi hệ thống và không hoàn tác được',
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Đồng ý',
      confirmButtonColor: '#DC2626',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
      preConfirm: () => {
        ProductService.delete([id]);
        return navigate(`${routerLinks('Product')}?tab=2`);
      },
    }),
  );
};

export const convertDecimal = (value) => {
  if (isNaN(Number(String(value)?.replace(/\s/g, '')?.replace(',', '.')))) {
    return;
  }
  return Number(String(value)?.replace(/\s/g, '')?.replace(',', '.'));
};
export const convertDecimalStr = (value) => String(value)?.replace(/\s/g, '')?.replace('.', ',');

export const blockInvalidCharForPercent = (e, inputRef) => {
  let chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    ',',
    'ArrowRight',
    'ArrowLeft',
    'Enter',
    'Tab'
  ]
  if (e.ctrlKey || e.metaKey) {
    chars = chars.concat(['a', 'c', 'x', 'v', 'y', 'z']);
  }
  !chars.includes(e.key) && e.preventDefault();
  if (e.key !== 'Backspace') {
    if (inputRef.current.input.value.includes(',')) {
      if (e.key === ',') {
        e.preventDefault();
      }
      if (inputRef.current.input.value.split(',')[1].length >= 2) {
        e.preventDefault();
      }
    }
  }
};


export const blockInvalidChar = (e) =>
{
  let chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    ',',
    '.',
    'ArrowRight',
    'ArrowLeft',
    'Enter',
    'Tab',
  ];
  if (e.ctrlKey || e.metaKey) {
    chars = chars.concat(['a', 'c', 'x', 'v', 'y', 'z']);
  }
  return !chars.includes(e.key) && e.preventDefault();
}


export const discountType = {
  FIXED_DISCOUNT: 'FIXED_DISCOUNT',
  FLEXIBLE_DISCOUNT: 'FLEXIBLE_DISCOUNT',
  DISCOUNT_BY_PERCENT: 'DISCOUNT_BY_PERCENT',
  DISCOUNT_BY_AMOUNT: 'DISCOUNT_BY_AMOUNT',
}



