const sizes = {
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
};

const devices = {
  tablet: `(min-width: ${sizes.tablet})`,
  laptop: `(min-width: ${sizes.laptop})`,
  desktop: `(min-width: ${sizes.desktop})`,
};

export default devices;
