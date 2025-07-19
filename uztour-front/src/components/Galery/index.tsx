"use client";
import classes from "./Galery.module.css";
function Galery({
  images,
  mainImage,
}: {
  images: string[];
  mainImage: string;
}) {
  return (
    <div className={classes.container}>
      <img
        className={`${classes.mainImage} ${
          images.length == 2 ? classes.mainImage2 : ""
        }`}
        src={mainImage}
      />
      <div
        className={`${classes.grid} ${images.length == 2 ? classes.grid2 : ""}`}
      >
        {images.slice(0, 4).map((image) => (
          <img key={image} className={classes.photo} src={image} />
        ))}
      </div>
    </div>
  );
}

export default Galery;
