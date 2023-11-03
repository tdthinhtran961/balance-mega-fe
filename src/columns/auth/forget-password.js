const Column = ({ t }) => {
  return [
    {
      name: 'email',
      title: t('routes.auth.reset-password.Recovery Email'),
      formItem: {
        placeholder: t('routes.auth.reset-password.Enter Recovery Email'),
        rules: [{ type: 'required' }, { type: 'email' }],
      },
    },
  ];
};

export default Column;
