import { useConfigs } from "../app/ConfigProvider";
import Icon, { getIconByCaseInsensitiveName } from "./Icons";

export default function Footer() {
  const configs = useConfigs();

  console.log("Socials Config", configs.socials, configs);
  return <footer style={{
    backgroundColor: configs.headerAssentColor,
    color: configs.fotterFontColor,
  }}>
    <div className="content">
      <img src={configs.fotterLogo || configs.logo} alt="logo" height="90" />
      <div className="socials">
        {configs.socials.map(social => <a href={social.link} key={social.name} title={social.name} target="_blank" rel="noreferrer">
          <Icon icon={getIconByCaseInsensitiveName(social.icon)} color={configs.fotterFontColor} />
        </a> )}
      </div>
      <span className="madeBy">
        Created by <a href="https://linkedin.com/in/victorwads" rel="noreferrer" target="_blank">Victor Wads</a>
      </span>
    </div>
  </footer>;
}