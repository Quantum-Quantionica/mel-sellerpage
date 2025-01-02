type CachedImageProps = React.ImgHTMLAttributes<HTMLImageElement>

const CachedImage = ({ src, ...props }: CachedImageProps) => {
  return <img {...props} alt={props.alt} src={src} />;
};

export default CachedImage;