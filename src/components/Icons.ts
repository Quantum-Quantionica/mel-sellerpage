import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as brands from '@fortawesome/free-brands-svg-icons'
import * as solid from '@fortawesome/free-solid-svg-icons'

export default Icon
export type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
export const Icons = { brands, solid }

export function getIconByCaseInsensitiveName(name: string): IconProp {
  const normalizedName = ICON_NAME_PREFIX + name.toLowerCase().replace('-', '');
  const foundIcon = iconNames.find(iconName =>
    iconName.lowerCaseName === normalizedName
  )?.icon;
  
  return foundIcon ? foundIcon : Icons.solid.faQuestion;
}

const iconNames = [
  ...mapIconPack(Icons.brands),
  ...mapIconPack(Icons.solid)
];
const ICON_NAME_PREFIX = "fa";

function mapIconPack(pack: object) {
  return Object.keys(pack).map(iconName => ({
    icon: pack[iconName] as IconProp,
    lowerCaseName: iconName.toLowerCase()
  }));
}
