const e = (data, cb, depth = 0) => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map(d => {
      if (Array.isArray(d.list) && d.list.length) {
        d.list = e(d.list, cb, depth + 1);
      }
      return cb(d, depth);
    });
  };
  
  export default data => {
    const withChildNum = e(data, (d) => {
      let childNum = 0;
      if (Array.isArray(d.list)) {
        childNum = d.list.length;
      }
      d.child_num = childNum;
      return d;
    });
    return e(withChildNum, (d, depth) => {
      d.depth = depth;
      return d;
    });
  };
  