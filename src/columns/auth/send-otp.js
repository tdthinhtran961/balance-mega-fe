const Column = ({ t }) => {
  return [
    {
      name: 'otp',
      title: 'Mã OTP',
      formItem: {
        placeholder: 'Mã OTP',
        rules: [{ type: 'required' }],
      },
    },
  ];
};

export default Column;
