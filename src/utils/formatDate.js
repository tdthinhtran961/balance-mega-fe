export function getFormattedDate(date) {
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return day + '/' + month + '/' + year;
}

export function formatDateString(dateString) {
  if (dateString)
    return (dateString = dateString.substr(6, 4) + '/' + dateString.substr(3, 2) + '/' + dateString.substr(0, 2));
  return dateString;
}

export function reFormatDateString(dateString) {
  const parts = dateString.split('/');
  const date1 = parts[2] + '/' + parts[1] + '/' + parts[0];
  return date1;
}

export function formatSubmit(dateString) {
  if (dateString) return dateString.replace(/\//g, '-');
  return dateString;
}
