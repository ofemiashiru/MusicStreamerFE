import { LoaderCircle } from "lucide-react";

import Link from "next/link";

import styles from "@/styles/Artists.module.css";

const ArtistsComp = ({ artists }) => {
  if (!artists || artists.length === 0) {
    return <LoaderCircle className={styles.animatespin} />;
  }

  return (
    <div className={styles.appContainer}>
      <div className={`flex flex-wrap`}>
        <div className={`${styles.artistscontainer}`}>
          {artists.map((artist) => (
            <Link key={artist.id} href={`/artists/${artist.slug}`} passHref>
              <h3 className={`${styles.artistheader}`}>{artist.name}</h3>
              <img src={artist.image} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistsComp;
