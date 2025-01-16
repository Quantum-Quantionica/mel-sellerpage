import { useConfigs } from "../app/ConfigProvider";

interface EmptyPageProps {
  name: string;
}

export default function EmptyPage({ name }: EmptyPageProps) {
  const configs = useConfigs();

  const normalizedNumber = configs.whatsappNumber?.replace(/\D/g, '');

  return (
    <div className="content">
      <h1>{name} PlaceHolder Page</h1>
      <p>Content for {name} goes here</p>

      {configs.whatsappNumber && <>
        <p>Whatsapp: {configs.whatsappNumber}</p>
        <a href={`https://wa.me/${normalizedNumber}`}>Send a message</a>
      </>}
    </div>
  );
}