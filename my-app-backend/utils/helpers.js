 const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${process.env.BASE_URL}${imagePath}`;
};

module.exports = getFullImageUrl;
