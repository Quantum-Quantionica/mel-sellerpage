interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const CachedImage: React.FC<CachedImageProps> = ({ src, ...props }) => {
  return <img {...props} alt={props.alt} src={src} />;
};

export default CachedImage;