import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

import Link from "next/link";

import styles from "@/styles/Artists.module.css";

const ArtistsComp = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [artistsStatusMessage, setArtistsStatusMessage] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/artists");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedArtists = await response.json();
        if (fetchedArtists.length > 0) {
          fetchedArtists.sort((a, b) => a.name.localeCompare(b.name));
          setArtists(fetchedArtists);
        } else {
          setArtistsStatusMessage("No artists found.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
        setArtistsStatusMessage(
          "Error loading artists. Is the backend running?"
        );
      }
    };
    fetchArtists();
  }, []);

  return (
    <div className={styles.appContainer}>
      <div className={`${styles.artists}`}>
        {isLoading && <LoaderCircle className={styles.animatespin} />}
        {!isLoading && artists.length > 0 ? (
          <div className={styles.artistscontainer}>
            {artists.map((artist) => (
              <Link key={artist.id} href={`/artists/${artist.slug}`} passHref>
                <h3 className={styles.artistheader}>{artist.name}</h3>
                <img src={artist.image} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="">{artistsStatusMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ArtistsComp;
