import { FieldRendererPros } from "..";
import { WithId } from "../../../data/provider";

const TagsRenderer = <T extends WithId>({name}: FieldRendererPros<T>) => {
  return <div>{name}</div>;
};
export default TagsRenderer;