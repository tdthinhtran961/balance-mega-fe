const Util = (time, hour = true) => {
  const timer = new Date(time);
  const yyyy = timer.getFullYear();
  let mm = timer.getMonth() + 1; // Months start at 0!
  let dd = timer.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '/' + mm + '/' + yyyy;
  if (hour)
    return (
      formattedToday +
      ' - ' +
      new Date(time).getHours() +
      ':' +
      (new Date(time).getMinutes() < 10 ? '0' : '') +
      new Date(time).getMinutes()
    );

  return formattedToday;
};

export default Util;
