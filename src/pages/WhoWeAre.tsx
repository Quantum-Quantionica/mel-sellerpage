import { useEffect, useState } from "react";
import ConfigsCache from "../configs/siteConfigs";
import { Attendant } from "../data/attendants";

let cacheAttendant: Attendant | null = null;

const maxHeigthSizeCss = 'calc(100vh - 115px - 106px)';

export default function WhoWeAre() {
  const [attendant, setAttendant] = useState(cacheAttendant);

  useEffect(() => {
    ConfigsCache.getAttendant().then(attendant => {
      cacheAttendant = attendant;
      setAttendant(attendant);
    });
  }, []);

  const culture = attendant?.organizationalCulture;

  return (
    <div className="content" style={{ paddingLeft: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1em' }}>
        <div style={{ 
          maxWidth: '30%',
          maxHeight: maxHeigthSizeCss,
          flex: 1,
          backgroundImage: `url(${attendant?.photo})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}>
        </div>
        <div style={{ flex: 1 }} >
          <h1>{attendant?.brand}</h1>
          <div>{attendant?.title}</div>
          {attendant?.registration && <div>{attendant?.registration}</div>}
          {attendant?.slogan && <h2>{attendant?.slogan}</h2>}
          {attendant?.history && <p>{attendant?.history}</p>}
          {culture?.mission && <p>{culture?.mission}</p>}
          {culture?.vision && <p>{culture?.vision}</p>}
          {culture?.values && <p>{culture?.values}</p>}
          {attendant?.formation && <p>{attendant?.formation}</p>}
        </div>
      </div>
    </div>
  );
}