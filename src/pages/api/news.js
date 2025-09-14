// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      headLine: "The Head Line",
      link: "https://www.google.com",
      image:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      id: 2,
      headLine: "The Head Line 2",
      link: "https://www.google.com",
      image:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
  ]);
}
