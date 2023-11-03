export default {
  alias: 'numeric',
  // allowMinus: true,
  // allowPlus: true,
  groupSeparator: '.',
  // autoGroup: true,
  // digits: 2,
  // digitsOptional: true,
  radixPoint: ',',
  placeholder: ' ',
  autoUnmask: true,
  // max: 999999999,
  // removeMaskOnSubmit: true,
  // clearMaskOnLostFocus: false,
  onBeforePaste: function (pastedValue, opts) {
    pastedValue = pastedValue.trim();
    const value = this.el.value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, opts.groupSeparator)
      .trim();
    return pastedValue
      .replace(value.substring(this.el.selectionStart, this.el.selectionEnd), '')
      .replace(value.substring(this.el.selectionStart, this.el.selectionEnd), '')
      .replaceAll('.', '');
  },
};
