// "nature_4" -> "Nature photo 4"; anything else is shown as-is.
export const describePhoto = (name) => {
  const match = /^([a-z]+)_(\d+)$/i.exec(name);
  if (!match) return name;
  const [, category, number] = match;
  return `${category[0].toUpperCase()}${category.slice(1)} photo ${number}`;
};

const ImageCard = ({ name, url, frame }) => (
  <figure className="frame">
    <div className="frame-film">
      <img
        className="frame-image"
        src={url}
        alt={describePhoto(name)}
        width="800"
        height="1067"
        loading="lazy"
      />
    </div>
    <figcaption className="frame-caption">
      <span className="frame-number">{String(frame).padStart(2, "0")}</span>
      <span className="frame-name">{name}</span>
      <a
        className="frame-download"
        href={url}
        download={name}
        aria-label={`Download ${describePhoto(name)}`}
      >
        Download
      </a>
    </figcaption>
  </figure>
);

export default ImageCard;
