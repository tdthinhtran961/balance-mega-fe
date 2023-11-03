import moment from 'moment';

const Util = (columns, values, exportData = true) => {
  columns
    .filter((item) => !!item && !!item.formItem)
    .map((item) => {
      if (item.formItem && item.formItem.convert) {
        if (typeof item.name === 'object' && item.name.length) {
          switch (item.name.length) {
            case 2:
              values[item.name[0]][item.name[1]] = item.formItem.convert(values[item.name[0]][item.name[1]]);
              break;
            case 3:
              values[item.name[0]][item.name[1]][item.name[2]] = item.formItem.convert(
                values[item.name[0]][item.name[1]][item.name[2]],
              );
              break;
            default:
              values[item.name[0]] = item.formItem.convert(values[item.name[0]]);
              break;
          }
        } else {
          values[item.name] = item.formItem.convert(values[item.name]);
        }
      } else {
        switch (item.formItem.type) {
          case 'switch':
            if (typeof values[item.name] === 'undefined' || typeof item.name === 'object') {
              if (typeof item.name === 'object' && item.name.length) {
                switch (item.name.length) {
                  case 2:
                    if (typeof values[item.name[0]][item.name[1]] === 'undefined') {
                      values[item.name[0]][item.name[1]] = false;
                    }
                    break;
                  case 3:
                    if (typeof values[item.name[0]][item.name[1]][item.name[2]] === 'undefined') {
                      values[item.name[0]][item.name[1]][item.name[2]] = false;
                    }
                    break;
                  default:
                    if (typeof values[item.name[0]] === 'undefined') {
                      values[item.name[0]] = false;
                    }
                    break;
                }
              } else {
                values[item.name] = false;
              }
            }
            break;
          case 'upload':
            if (item.formItem.action === undefined && (values[item.name] || typeof item.name === 'object')) {
              if (typeof item.name === 'object' && item.name.length) {
                switch (item.name.length) {
                  case 2:
                    if (values[item.name[0]][item.name[1]]) {
                      values[item.name[0]][item.name[1]] = values[item.name[0]][item.name[1]].filter(
                        (_item) => _item.status === 'done' || !_item.status,
                      );
                    }
                    break;
                  case 3:
                    if (values[item.name[0]][item.name[1]][item.name[2]]) {
                      values[item.name[0]][item.name[1]][item.name[2]] = values[item.name[0]][item.name[1]][
                        item.name[2]
                      ].filter((_item) => _item.status === 'done' || !_item.status);
                    }
                    break;
                  default:
                    if (values[item.name[0]]) {
                      values[item.name[0]] = values[item.name[0]].filter(
                        (_item) => _item.status === 'done' || !_item.status,
                      );
                    }
                    break;
                }
              } else {
                values[item.name] = values[item.name].filter((_item) => _item.status === 'done' || !_item.status);
              }
            }
            break;
          case 'date':
            if (values[item.name] || typeof item.name === 'object') {
              if (typeof item.name === 'object' && item.name.length) {
                switch (item.name.length) {
                  case 2:
                    if (values[item.name[0]][item.name[1]]) {
                      if (exportData) {
                        values[item.name[0]][item.name[1]] =
                          values[item.name[0]][item.name[1]].format('YYYY-MM-DDTHH:mm:ss[Z]');
                      } else {
                        values[item.name[0]][item.name[1]] = moment(values[item.name[0]][item.name[1]]).utc();
                      }
                    }
                    break;
                  case 3:
                    if (values[item.name[0]][item.name[1]]) {
                      if (exportData) {
                        values[item.name[0]][item.name[1]][item.name[2]] =
                          values[item.name[0]][item.name[1]][item.name[2]].format('YYYY-MM-DDTHH:mm:ss[Z]');
                      } else {
                        values[item.name[0]][item.name[1]][item.name[2]] = moment(
                          values[item.name[0]][item.name[1]][item.name[2]],
                        ).utc();
                      }
                    }
                    break;
                  default:
                    if (values[item.name[0]]) {
                      if (exportData) {
                        values[item.name[0]] = values[item.name[0]].format('YYYY-MM-DDTHH:mm:ss[Z]');
                      } else {
                        values[item.name[0]] = moment(values[item.name[0]]).utc();
                      }
                    }
                    break;
                }
              } else {
                if (exportData) {
                  values[item.name] = values[item.name].format('YYYY-MM-DDTHH:mm:ss[Z]');
                } else {
                  values[item.name] = moment(values[item.name]).utc();
                }
              }
            }
            break;
          case 'date_range':
            if (!!values[item.name] || typeof item.name === 'object') {
              if (typeof item.name === 'object' && item.name.length) {
                switch (item.name.length) {
                  case 2:
                    if (values[item.name[0]][item.name[1]]) {
                      if (exportData) {
                        values[item.name[0]][item.name[1]] = [
                          moment(values[item.name[0]][item.name[1]][0]).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                          moment(values[item.name[0]][item.name[1]][1]).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                        ];
                      } else {
                        values[item.name[0]][item.name[1]] = [
                          moment(values[item.name[0]][item.name[1]][0]).utc(),
                          moment(values[item.name[0]][item.name[1]][1]).utc(),
                        ];
                      }
                    }
                    break;
                  case 3:
                    if (values[item.name[0]][item.name[1]][item.name[2]]) {
                      if (exportData) {
                        values[item.name[0]][item.name[1]][item.name[2]] = [
                          moment(values[item.name[0]][item.name[1]][item.name[2]][0]).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                          moment(values[item.name[0]][item.name[1]][item.name[2]][1]).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                        ];
                      } else {
                        values[item.name[0]][item.name[1]][item.name[2]] = [
                          moment(values[item.name[0]][item.name[1]][item.name[2]][0]).utc(),
                          moment(values[item.name[0]][item.name[1]][item.name[2]][1]).utc(),
                        ];
                      }
                    }
                    break;
                  default:
                    if (values[item.name[0]]) {
                      if (exportData) {
                        values[item.name[0]] = [
                          moment(values[item.name[0]][0]).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                          moment(values[item.name[0]][1]).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                        ];
                      } else {
                        values[item.name[0]] = [
                          moment(values[item.name[0]][0]).utc(),
                          moment(values[item.name[0]][1]).utc(),
                        ];
                      }
                    }
                    break;
                }
              } else {
                if (exportData) {
                  values[item.name] = [
                    moment(values[item.name][0]).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                    moment(values[item.name][1]).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                  ];
                } else {
                  values[item.name] = [moment(values[item.name][0]).utc(), moment(values[item.name][1]).utc()];
                }
              }
            }
            break;
          case 'number':
            if (!exportData && values && (values[item.name] || typeof item.name === 'object')) {
              if (typeof item.name === 'object' && item.name.length) {
                switch (item.name.length) {
                  case 2:
                    if (values[item.name[0]][item.name[1]]) {
                      values[item.name[0]][item.name[1]] = parseFloat(values[item.name[0]][item.name[1]]);
                    }
                    break;
                  case 3:
                    if (values[item.name[0]][item.name[1]][item.name[2]]) {
                      values[item.name[0]][item.name[1]][item.name[2]] = parseFloat(
                        values[item.name[0]][item.name[1]][item.name[3]],
                      );
                    }
                    break;
                  default:
                    if (values[item.name[0]]) {
                      values[item.name[0]] = parseFloat(values[item.name[0]]);
                    }
                    break;
                }
              } else {
                if (values[item.name]) {
                  values[item.name] = parseFloat(values[item.name]);
                }
              }
            }
            break;
          default:
            if (typeof values[item.name] === 'string') {
              values[item.name] = values[item.name].trim();
            }
        }
      }
      return item;
    });
  return values;
};
export default Util;
