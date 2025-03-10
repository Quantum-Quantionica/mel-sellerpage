interface EmptyPageProps {
  name: string;
}

export default function EmptyPage({ name }: EmptyPageProps) {
  return (
    <div className="content">
      <h1>{name} PlaceHolder Page</h1>
      <p>Content for {name} goes here</p>
    </div>
  );
}