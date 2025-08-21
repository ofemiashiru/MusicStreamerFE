// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const songs = [
    {
      songId: "09a52fb7-b8a6-485d-9b35-5a98849cd969",
      albumId: "4242231b-69ab-43fd-aebe-119b76366440",
      trackNumber: 0,
      title: "Rich Mans World",
      artist: "Spice Cabinet feat Nas",
      audio:
        "https://album-audio-mp.s3.eu-west-1.amazonaws.com/ReggieNelson.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "e5570de8-2ac9-4ce9-86c6-96bfc9fc0358",
      albumId: "4242231b-69ab-43fd-aebe-119b76366440",
      trackNumber: 1,
      title: "Disco",
      artist: "Spice Cabinet feat AZ",
      audio: "https://album-audio-mp.s3.eu-west-1.amazonaws.com/Disco.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "5cc53f23-8265-4b48-97c4-fec5be88c0d9",
      albumId: "4242231b-69ab-43fd-aebe-119b76366440",
      trackNumber: 2,
      title: "Hard To List",
      artist: "Spice Cabinet feat Kool G Rap",
      audio: "https://album-audio-mp.s3.eu-west-1.amazonaws.com/Hardtolist.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "757cfd3b-1a2f-478f-8c1e-13656593c282",
      albumId: "4242231b-69ab-43fd-aebe-119b76366440",
      trackNumber: 3,
      title: "Hurting",
      artist: "Spice Cabinet feat Black Thought",
      audio:
        "https://album-audio-mp.s3.eu-west-1.amazonaws.com/HurtinIGive.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "fe392e1a-8bbe-42e8-869c-f842c513acd7",
      albumId: "4242231b-69ab-43fd-aebe-119b76366440",
      trackNumber: 4,
      title: "Rush The Stage",
      artist: "Spice Cabinet feat Sean Price",
      audio:
        "https://album-audio-mp.s3.eu-west-1.amazonaws.com/RushTheStage.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "aNh92e1a-8bbe-42e8-769c-f842c513acd7",
      albumId: "6742231b-69ab-43fd-aebe-119b76361040",
      trackNumber: 0,
      title: "A Different Song",
      artist: "Spice Cabinet",
      audio:
        "https://album-audio-mp.s3.eu-west-1.amazonaws.com/RushTheStage.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
  ];

  const { albumId } = req.query;

  console.log(albumId);

  if (!albumId) {
    // If no albumId is provided, return an error or all songs
    return res.status(400).json({ error: "Missing albumId query parameter" });
  }

  // Filter the songs based on the albumId
  const filteredSongs = songs.filter((song) => song.albumId === albumId);

  if (filteredSongs.length > 0) {
    res.status(200).json(filteredSongs);
  } else {
    res.status(404).json({ error: `No songs found for albumId: ${albumId}` });
  }
}
