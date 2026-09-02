import type { PlaceImage } from "@kuda-krym/contracts";

import styles from "./image-credit.module.css";

type ImageCreditProps = Readonly<{
  image: PlaceImage;
}>;

export function ImageCredit({ image }: ImageCreditProps) {
  return (
    <span className={styles.credit}>
      <a href={image.sourceUrl} target="_blank" rel="noreferrer">
        Фото: {image.author}
      </a>
      <span aria-hidden="true">·</span>
      {image.licenseUrl ? (
        <a href={image.licenseUrl} target="_blank" rel="noreferrer">
          {image.license}
        </a>
      ) : (
        <span>{image.license}</span>
      )}
    </span>
  );
}
