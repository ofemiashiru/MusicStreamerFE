// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json([
    {
      albumId: "4242231b-69ab-43fd-aebe-119b76366440",
      title: "Maggi Mixtape vol 1",
      artist: "Spice Cabinet",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      albumId: "6742231b-69ab-43fd-aebe-119b76361040",
      title: "No Place Like Home",
      artist: "Spice Cabinet",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
  ]);
}
