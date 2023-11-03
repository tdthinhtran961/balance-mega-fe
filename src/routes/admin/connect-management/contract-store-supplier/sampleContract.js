// import { useAuth } from 'global';
// import { formatCurrency } from 'utils';
import React,{ Fragment } from 'react';
import './index.less';
export default function SampleContract() {
  //   const { formatDate } = useAuth();
  //   const [signContract, setSignContract] = useState(false);
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
                    Hôm nay ngày 05-07-2022 tại địa chỉ 12 Quá Là Chán, Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội.
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
                          <strong>BÊN CHO THUÊ (Gọi tắt là bên A):</strong>
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
                          <strong>BÊN THUÊ (Gọi tắt là bên B): </strong>
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
                <td colSpan="3">Hai bên đồng ý thanh lý hợp đồng từ ngày .</td>
              </tr>
              <tr>
                <td colSpan="3">
                  Kể từ ngày hợp đồng thanh lý này được hai bên ký kết thì hợp đồng nêu trên không còn giá trị nữa.
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  Giấy báo tiền đính kèm mới nhất (nếu có):{' '}
                  <a className="text-blue-400 underline"> Giấy báo tiền hàng</a>
                </td>
              </tr>
              <tr>
                <td colSpan="3">Tổng nợ mới hiện tại: 0 đồng.</td>
              </tr>
              <tr>
                <td colSpan="3">
                  Đồng thời, căn cứ theo hợp đồng cọc có mã, bên A đã nhận số tiền cọc từ bên B là 0 đồng.
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <strong>Các khoản khấu trừ:</strong>
                  <br />
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <table width="100%" className="table" border="true" cellSpacing="0" cellPadding="3">
                    <thead>
                      <tr>
                        <th width="20px">STT</th>
                        <th>Nội dung</th>
                        <th width="350px">Số tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {data?.liquidatedDeductionItems?.map((elem, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{elem.content}</td>
                        <td align="right">{elem?.price ? formatCurrency(elem.price, '') : ''}</td>
                      </tr>
                    ))}
                    <tr>
                      <th colSpan="2">Tổng cộng</th>
                      <td align="right">{data?.totalDeduction ? formatCurrency(data?.totalDeduction, '') : ''}</td>
                    </tr> */}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan="3">Sau khi thống nhất, bên A sẽ thanh toán lại cho bên B số tiền cọc là đồng.</td>
              </tr>
              <tr>
                <td colSpan="3">Chúng tôi đã đọc và hiểu rõ nội dung hợp đồng thanh lý và đồng ý ký tên.</td>
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
                    <p>Hợp đồng được ký bởi tên chủ cung ứng ngày 1/7/2022</p>
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
                  <button className="ml-2 ant-btn ant-btn-default bg-green-200">In</button>
                  <button className="ml-2 ant-btn ant-btn-default bg-blue-200">Xuất hợp đồng</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-start mt-10 ">
        <button
          onClick={() => {
            window.history.back();
          }}
          className="px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
            text-[14px] p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1"
          id="backBtn"
        >
          Trở về
        </button>
      </div>
    </Fragment>
  );
}
