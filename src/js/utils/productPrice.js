export const getDiscountedPrice = (product) => {
  const discount = product.discountPercentage || 0;
  return (product.price * (1 - discount / 100)).toFixed(2);
};

export const hasDiscount = (product) => {
  return (product.discountPercentage || 0) > 0;
};
