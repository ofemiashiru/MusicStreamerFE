// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const albums = [
    {
      albumId: "4242231b-69ab-43fd-aebe-119b76366440",
      artistId: 2,
      title: "Spice Cabinet vol 1",
      artist: "Solomons Garden",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      albumId: "6742231b-69ab-43fd-aebe-119b76361040",
      title: "Invisible Empires",
      artistId: 1,
      artist: "MKFWI",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/Gemini_Generated_Image_fem3sbfem3sbfem3.png",
    },
  ];

  const { artistId } = req.query;

  if (artistId) {
    const filteredAlbums = albums.filter((album) => album.artistId == artistId);

    res.status(200).json(filteredAlbums);
  } else {
    res.status(200).json(albums);
  }
}
