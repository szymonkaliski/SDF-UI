export const distVec = (a, b) => {
  const xd = a.get('x') - b.get('x');
  const yd = a.get('y') - b.get('y');

  return Math.sqrt(xd * xd + yd * yd);
};

export const addVec = (a, b) => {
  return {
    x: a.get('x') + b.get('x'),
    y: a.get('y') + b.get('y')
  };
};

export const randomId = () => `${(new Date()).getTime()}`;

