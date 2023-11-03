const formatTreeSelect = (array) => {
  if (array) {
    return array.map((item) => {
      const children = item.children && item.children.length ? formatTreeSelect(item.children) : null;
      return {
        value: item.id,
        title: item.name,
        selectable: !(item.children && item.children.length),
        children,
      };
    });
  }
};

export default formatTreeSelect;
