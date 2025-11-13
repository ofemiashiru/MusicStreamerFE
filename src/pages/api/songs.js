// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const songs = [
    {
      songId: "09a52fb7-b8a6-485d-9b35-5a98849cd969",
      albumId: "4242231b-69ab-43fd-aebe-119b76366440",
      trackNumber: 0,
      title: "Rich Mans World",
      artist: "Ajasko",
      manifestKey: "Gas/Gas",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "e5570de8-2ac9-4ce9-86c6-96bfc9fc0358",
      albumId: "4242231b-69ab-43fd-aebe-119b76366440",
      trackNumber: 1,
      title: "Ending",
      artist: "Ajasko",
      manifestKey: "Ending/Ending",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "aNh92e1a-8bbe-42e8-769c-f842c513acd7",
      albumId: "6742231b-69ab-43fd-aebe-119b76361040",
      trackNumber: 0,
      title: "Invisible Empires",
      artist: "MKFWI feat. Ajasko",
      manifestKey: "Gas/Gas",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/Gemini_Generated_Image_fem3sbfem3sbfem3.png",
    },
  ];

  const { albumId } = req.query;

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
