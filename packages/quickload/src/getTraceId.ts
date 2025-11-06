// Extracting minimal duplicate code from AnalyticsClient to include in preload.
export const get64BitSpanId = (): string => {
  // Generates 64 bit string
  // Taken from openzipkin/zipkin-js
  // https://github.com/openzipkin/zipkin-js/blob/50d9c3afb662c2d18d688ecef66883d6c5326f4b/packages/zipkin/src/tracer/randomTraceId.js
  const digits = '0123456789abcdef';
  let n = '';
  for (let i = 0; i < 16; i += 1) {
    const rand = Math.floor(Math.random() * 16);
    n += digits[rand];
  }
  return n;
};

export const get128BitTraceId = (): string => {
  // Return 128 bit trace ids (32 hexadecimal digits)
  // https://github.com/openzipkin/zipkin-js/blob/98f7796d54199ccb2a81dea04c466a40814ccb24/packages/zipkin/src/tracer/index.js#L77
  // but support B3 single format with fist 32 bits (8 digits) as epoch seconds
  // https://github.com/openzipkin/b3-propagation/blob/master/STATUS.md#epoch128

  const epochSeconds = Math.floor(Date.now() / 1000).toString(16);
  const remainingBits = get64BitSpanId().slice(8) + get64BitSpanId();

  return epochSeconds + remainingBits;
};
