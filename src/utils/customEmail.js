const Util = (t) => {
  return [
    {
      type: 'custom',
      validator: () => ({
        validator(_, value) {
          const regexmail =
            /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!value || regexmail.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(t('components.form.ruleEmail'));
        },
      }),
    },
  ];
};

export default Util;
