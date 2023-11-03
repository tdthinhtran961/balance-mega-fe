// import { useAuth } from 'global';
// import { formatCurrency } from 'utils';
import { useAuth } from 'global';
import React, { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { routerLinks } from 'utils';

import './index.less';
export default function SampleContract() {
  //   const { formatDate } = useAuth();
  //   const [signContract, setSignContract] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const idSupplier = urlSearch.get('id');
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  // const subOrgId = user?.userInfor?.subOrgId;

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl text-teal-900">Hợp đồng kết nối</p>
        <div className="bg-white w-full px-4 rounded-xl mt-5 relative pb-5"></div>
        <div className="bg-white w-full p-4 text-black">
          <table width="100%" cellPadding="8">
            <tbody>
              <tr>
                <td align="center" colSpan="3">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM <br />
                  Độc lập - Tự do - Hạnh phúc <br />
                  --------------------
                </td>
              </tr>
              <tr>
                <td align="center" colSpan="3">
                  <strong>HỢP ĐỒNG</strong>
                  <p>Mã Hợp Đồng: HĐ_7-2022_287</p>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <p className="description">
                    Hôm nay ngày 05-07-2022 tại ......
                    Chúng tôi gồm:
                  </p>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <table width="100%" cellPadding="5">
                    <tbody>
                      <tr>
                        <td colSpan="3">
                          <strong>BALANCE (Gọi tắt là bên A):</strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[33%]">Họ và tên: </td>
                        <td className="w-[33%]">Số điện thoại:</td>
                        <td className="w-[33%]">Email: </td>
                      </tr>
                      <tr>
                        <td className="w-[33%]">Số CMND/CCCD/Passport: </td>
                        <td className="w-[33%]">Ngày cấp: </td>
                        <td className="w-[33%]">Nơi cấp: </td>
                      </tr>
                      <tr>
                        <td colSpan="3">Nơi ĐKTT:</td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <strong>NHÀ CUNG CẤP (Gọi tắt là bên B): </strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[33%]">Họ và tên:</td>
                        <td className="w-[33%]">Số điện thoại: </td>
                        <td className="w-[33%]">Email: </td>
                      </tr>
                      <tr>
                        <td className="w-[33%]">Số CMND/CCCD/Passport: </td>
                        <td className="w-[33%]">Ngày cấp:</td>
                        <td className="w-[33%]">Nơi cấp: </td>
                      </tr>
                      <tr>
                        <td colSpan="3">Nơi ĐKTT:</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <strong>Căn cứ vào hợp đồng có mã :</strong>
                  <br />
                </td>
              </tr>
              <tr>
                <td colSpan="3">Hai bên đồng ý ký kết hợp đồng từ ngày .</td>
              </tr>

              <tr>
                <td colSpan="3">Chúng tôi đã đọc và hiểu rõ nội dung hợp đồng và đồng ý ký tên.</td>
              </tr>
              <tr>
                <td colSpan="3">Biên bản hợp đồng này sau khi ký tên sẽ có giá trị theo luật định.</td>
              </tr>
              <tr>
                <td align="center" colSpan="2"></td>
              </tr>
              <tr>
                <td align="center" className="w-[50%]">
                  <strong>Bên A</strong> <br />
                  <button
                    className="ml-2 ant-btn ant-btn-default bg-red-200"
                    onClick={() => console.log('ký tên bên A')}
                  >
                    Ký tên
                  </button>
                  <div>
                    <em>(Ký tên)</em> <br />
                    <p>Hợp đồng được ký bởi tên chủ cung cấp ngày 1/7/2022</p>
                  </div>
                </td>
                <td></td>
                <td align="center" className="w-[50%]">
                  <strong>Bên B</strong> <br />
                  <button
                    className="ml-2 ant-btn ant-btn-default bg-red-200"
                    onClick={() => console.log('ký tên bên B')}
                  >
                    Ký tên
                  </button>
                  <div>
                    <em>(Ký tên)</em> <br />
                    <p>Hợp đồng được ký bởi tên chủ cửa hàng ngày 1/7/2022</p>
                  </div>
                </td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr align="center">
                <td colSpan="3">
                  <button className="ant-btn ant-btn-default bg-green-200">In</button>
                  <button className="!ml-5 ant-btn ant-btn-default bg-blue-200">Xuất hợp đồng</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between mt-10 ">
        {roleCode === 'ADMIN' ? (
          <button
            onClick={() => {
              navigate(routerLinks('SupplierEdit') + `?id=${idSupplier}&tab=6`);
            }}
            className="px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
            text-[14px] p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1"
            id="backBtn"
          >
            Trở về
          </button>
        ) : (
          <button
            onClick={() => {
              navigate(routerLinks('SupplierContract'));
            }}
            className="px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
            text-[14px] p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1"
            id="backBtn"
          >
            Trở về
          </button>
        )}
      </div>
    </Fragment>
  );
}
