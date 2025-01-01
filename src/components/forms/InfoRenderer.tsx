import { FieldRendererPros } from ".";
import { WithId } from "../../data/provider";

const InfoRenderer = <T extends WithId>({name}: FieldRendererPros<T>) => {
  return <div>{name}</div>;
};
export default InfoRenderer;