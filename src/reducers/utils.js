import uuid from 'uuid';

export const distVec = (a, b) => {
  const xd = a.x - b.x;
  const yd = a.y - b.y;

  return Math.sqrt(xd * xd + yd * yd);
};

export const addVec = (a, b) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
};

export const randomId = () => uuid.v4();

