import React from 'react';
import { Radio, Col, Row } from 'antd';
// import { routerLinks } from 'utils';
// import { useNavigate } from 'react-router';
// import "antd/dist/antd.css";
import './index.less';

// const FormItem = Form.Item;
// const RadioGroup = Radio.Group;
const RadioChooseType = ({
  setListProduct,
  setIsShowSelectProduct,
  setStep,
  setArrayProductlist,
  setDataSearchFollowCodeProduct,
  form,
  setEnableNcc,
  enableNcc,
  setImportCoupon,
}) => {
  // const navigate = useNavigate();
  // const [value, setValue] = useState(1);
  const onChange = (e) => {
    if (e.target.value === 2) {
      setStep(2);
      form.setFieldsValue({ code: '' });
      setEnableNcc(true);
      setArrayProductlist([]);
      setIsShowSelectProduct(true);
      setDataSearchFollowCodeProduct({});
      setListProduct([]);
      setImportCoupon(false);
    }
    if (e.target.value === 1) {
      setStep(1);
      setIsShowSelectProduct(false);
    }
  };

  return (
    <div className="radioCheck">
      <Radio.Group onChange={onChange} style={{ width: '100%' }} size="large" buttonStyle="outline" defaultValue={1}>
        <Row>
          <Col span={24} md={12} align="left">
            <Radio value={1}>
              <span className="ml-2 text-black text-[15px]">Trả hàng theo phiếu nhập hàng</span>
            </Radio>
          </Col>

          <Col span={24} md={12} align="left">
            <Radio value={2}>
              <span className="ml-2 text-black text-[15px]">Trả hàng không theo phiếu nhập hàng</span>
            </Radio>
          </Col>
        </Row>
      </Radio.Group>
    </div>
  );
};
export default RadioChooseType;
