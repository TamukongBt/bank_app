 //   serialize BigInt to Store
 function serialize(value) {
    const json = JSON.stringify(value, (key, value) =>
      typeof value === 'bigint' ? `BIGINT::${value}` : value,
    );
    return json;
  }

  //   Deserialize BigInt to Store
  function deserialize(value) {
    const json = JSON.parse(value, (key, value) => {
      if (typeof value === 'string' && value.startsWith('BIGINT::')) {
        return BigInt(value.substr(8));
      }
      return value;
    });
    return json;
  }
