import { Link, useParams } from "react-router-dom";

import AttendantsProvider, { Attendant } from "../../../main/data/attendants";
import SiteConfigsRenderer from "./SiteConfigsRenderer";

import { DynamicForm, DynamicList, ImageRenderer, ListRenderer, ListRendererConfigs, SocialRenderer, TextArea } from "../../forms";
import Icon, { Icons } from "../../../components/Icons";
import OrganizationalCultureRenderer from "./OrganizationalCultureRenderer";

const newUrl = 'new';
const provider = new AttendantsProvider();
const windowBaseURL = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;

const AttendantsPage = () => {
  const { id } = useParams<{ id: string }>();
  const getSiteUrl = (item: Attendant) =>
    `${windowBaseURL}?site=${item.id}`;

  if (!id)
    return <>
      <Link to={newUrl}><button>
        <Icon icon={Icons.solid.faPlus} />
        Add Attendant
      </button></Link>
      <DynamicList provider={provider} title="Attendant" nameKey="name"
        adicionalFields={item => <>
          <span><b>Domains: </b>{item.domains?.join(', ')}</span>
          <a href={getSiteUrl(item)} target="_blank" rel="noreferrer"><button>Open Site</button></a>
        </>} />
    </>;

  return (
    <DynamicForm<Attendant>
      title="Atendentes"
      id={id === newUrl ? undefined : id}
      provider={new AttendantsProvider()}
      fieldRenderers={{
        photo: ImageRenderer,
        domains: ListRenderer,
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