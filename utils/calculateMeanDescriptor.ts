const calculateMeanDescriptor = (descriptors: Float32Array[]): Float32Array => {
  if (descriptors.length === 0) return new Float32Array();

  const meanDescriptor = new Float32Array(descriptors[0].length);

  for (let i = 0; i < descriptors.length; i++) {
    for (let j = 0; j < descriptors[i].length; j++) {
      meanDescriptor[j] += descriptors[i][j];
    }
  }

  for (let j = 0; j < meanDescriptor.length; j++) {
    meanDescriptor[j] /= descriptors.length;
  }

  return meanDescriptor;
};
