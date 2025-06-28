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
      <img className={classes.mainImage} src={mainImage} />
      <div className={classes.grid}>
        {images.map((image) => (
          <img key={image} className={classes.photo} src={image} />
        ))}
      </div>
    </div>
  );
}

export default Galery;
