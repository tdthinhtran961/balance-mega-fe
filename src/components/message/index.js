import { t } from 'i18next';

const Component = {
  success: ({
    text,
    title = t('components.message.Success'),
    cancelButtonText = t('components.message.Close'),
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = false,
    padding = 0,
    timer = 3000,
    reverseButtons = true,
  }) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'success',
        timer,
        title,
        text,
        cancelButtonText,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        padding,
        reverseButtons,
      }),
    ),
  warning: ({
    text,
    title = t('components.message.Warning'),
    cancelButtonText = t('components.message.Close'),
    confirmButtonText = t('components.message.Ok'),
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = true,
    padding = 0,
    reverseButtons = true,
  }) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'warning',
        title,
        text,
        cancelButtonText,
        confirmButtonText,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        padding,
        reverseButtons,
      }),
    ),
  error: ({
    text,
    title = t('components.message.Fail'),
    cancelButtonText = t('components.message.Close'),
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = false,
    padding = 0,
    reverseButtons = true,
  }) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'error',
        title,
        text,
        cancelButtonText,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        padding,
        focusCancel: showCancelButton,
        reverseButtons,
      }),
    ),
  confirm: ({
    text,
    title = '',
    cancelButtonText = t('components.message.Close'),
    confirmButtonText = t('components.message.Ok'),
    onConfirm,
    onDenied = () => null,
    confirmButtonColor = '#ef4444',
    cancelButtonColor = '#ffffff',
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = true,
    padding = 0,
    reverseButtons = true,
    html,
    width
  }) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'warning',
        text,
        title,
        cancelButtonText,
        confirmButtonText,
        confirmButtonColor,
        cancelButtonColor,
        showCancelButton,
        showConfirmButton,
        showCloseButton,
        padding,
        reverseButtons,
        html,
        width
      }).then((result) => {
        if (result.isConfirmed) {
          onConfirm();
        } else if (result.isDenied) {
          onDenied();
        }
      }),
    ),
    confirm2: ({
      text,
      title = '',
      cancelButtonText = t('components.message.Close'),
      confirmButtonText = t('components.message.Ok'),
      onConfirm,
      onDenied,
      confirmButtonColor = '#ef4444',
      cancelButtonColor = '#ffffff',
      showCloseButton = true,
      showCancelButton = true,
      showConfirmButton = true,
      padding = 0,
      reverseButtons = true,
      html,
      width
    }) =>
      import('sweetalert2').then(({ default: Swal }) =>
        Swal.fire({
          icon: 'warning',
          text,
          title,
          cancelButtonText,
          confirmButtonText,
          confirmButtonColor,
          cancelButtonColor,
          showCancelButton,
          showConfirmButton,
          showCloseButton,
          padding,
          reverseButtons,
          html,
          width
        }).then((result) => {
          if (result.isConfirmed) {
            onConfirm();
          } else if (result.isDenied) {
            onDenied();
          }
        }),
      ),
};
export default Component;
