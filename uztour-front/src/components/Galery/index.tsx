"use client";
import { useEffect, useState } from "react";
import classes from "./Galery.module.css";
function Galery({
  images,
  mainImage,
}: {
  images: string[];
  mainImage: string;
}) {
  const [numImages, setNumImages] = useState(-1);

  useEffect(() => {
    const updateNumImages = () => {
      setNumImages(window.innerWidth > 600 ? 4 : 2);
    };

    updateNumImages(); // set initially
    window.addEventListener("resize", updateNumImages);

    return () => window.removeEventListener("resize", updateNumImages);
  }, []);

  return (
    <div className={classes.container}>
      <img
        className={`${classes.mainImage} ${
          images.length == 2 ? classes.mainImage2 : ""
        }`}
        src={mainImage}
      />
      {numImages !== -1 && (
        <div
          className={`${classes.grid} ${
            images.length == 2 ? classes.grid2 : ""
          }`}
        >
          {images.slice(0, numImages).map((image) => (
            <img key={image} className={classes.photo} src={image} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Galery;
