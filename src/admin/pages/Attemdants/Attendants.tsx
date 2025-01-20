import { Link, useParams } from "react-router-dom";

import AttendantsProvider, { Attendant } from "../../../data/attendants";
import { DynamicForm, DynamicList, ImageRenderer, ListRenderer, ListRendererConfigs, SocialRenderer, TextArea } from "../../../components/forms";
import OrganizationalCultureRenderer from "./OrganizationalCultureRenderer";
import SiteConfigsRenderer from "./SiteConfigsRenderer";
import Icon, { Icons } from "../../../components/Icons";

const newUrl = 'new';
const provider = new AttendantsProvider();
const windowBaseURL = `${window.location.protocol}//${window.location.hostname}${window.location.port?':'+window.location.port:''}`;

const AttendantsPage = () => {
  const { id } = useParams<{ id: string }>();  
  const getSiteUrl = (item: Attendant) => 
    `${windowBaseURL}?site=${item.id}`;

  if(!id)
    return <>
      <Link to={newUrl}><button>
        <Icon icon={Icons.solid.faPlus} />
        Add Attendant
      </button></Link>
      <DynamicList provider={provider} title="Attendant" nameKey="name"
        adicionalFields={item => <a href={getSiteUrl(item)} target="_blank" rel="noreferrer">
          <button>Open Site</button>
        </a>} />
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