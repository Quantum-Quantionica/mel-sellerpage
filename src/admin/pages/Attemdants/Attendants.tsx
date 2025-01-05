import { Link, useParams } from "react-router-dom";

import AttendantsProvider, { Attendant } from "../../../data/attendants";
import { DynamicForm, DynamicList, ImageRenderer, ListRenderer, ListRendererConfigs, SocialRenderer, TextArea } from "../../../components/forms";
import OrganizationalCultureRenderer from "./OrganizationalCultureRenderer";
import SiteConfigsRenderer from "./SiteConfigsRenderer";

const newUrl = 'new';
const provider = new AttendantsProvider();

const AttendantsPage = () => {
  const { id } = useParams<{ id: string }>();  

  if(!id)
    return <>
      <Link to={newUrl}>Add Attendant</Link>
      <DynamicList provider={provider} title="Attendant" nameKey="name" />
    </>;

  return (
    <DynamicForm<Attendant>
      title="Atendentes"
      id={id === newUrl ? undefined : id}
      provider={new AttendantsProvider()}
      fieldRenderers={{
        photo: ImageRenderer,
        socialLinks: ListRenderer,
        history: TextArea,
        formation: TextArea,
        organizationalCulture: OrganizationalCultureRenderer,
        siteConfig: SiteConfigsRenderer,
      }}
      fieldConfigs={{
        socialLinks: {
          renderer: SocialRenderer,
        } as ListRendererConfigs<Attendant>,
      }}
    />
  );
};

export default AttendantsPage;