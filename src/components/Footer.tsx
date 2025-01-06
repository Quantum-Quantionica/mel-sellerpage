import { useConfigs } from "../app/ConfigProvider";

export default function Footer() {
  const configs = useConfigs();

  return <footer style={{
    backgroundColor: configs.headerAssentColor,
    color: configs.fotterFontColor,
  }}>
    <div className="content">
      <h2>Footer</h2>
      <p>Footer content goes here</p>
    </div>
  </footer>;
}