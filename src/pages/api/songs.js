// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json([
    {
      songId: "09a52fb7-b8a6-485d-9b35-5a98849cd969",
      title: "Rich Mans World",
      artist: "Spice Cabinet",
      audio:
        "https://album-audio-mp.s3.eu-west-1.amazonaws.com/ReggieNelson.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "e5570de8-2ac9-4ce9-86c6-96bfc9fc0358",
      title: "Disco",
      artist: "Spice Cabinet",
      audio: "https://album-audio-mp.s3.eu-west-1.amazonaws.com/Disco.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "5cc53f23-8265-4b48-97c4-fec5be88c0d9",
      title: "Hard To List",
      artist: "Spice Cabinet",
      audio: "https://album-audio-mp.s3.eu-west-1.amazonaws.com/Hardtolist.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "757cfd3b-1a2f-478f-8c1e-13656593c282",
      title: "Hurting",
      artist: "Spice Cabinet",
      audio:
        "https://album-audio-mp.s3.eu-west-1.amazonaws.com/HurtinIGive.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
    {
      songId: "fe392e1a-8bbe-42e8-869c-f842c513acd7",
      title: "Rush The Stage",
      artist: "Spice Cabinet",
      audio:
        "https://album-audio-mp.s3.eu-west-1.amazonaws.com/RushTheStage.wav",
      cover:
        "https://album-art-work-mp.s3.eu-west-1.amazonaws.com/spice_cabinet_artwork.jpg",
    },
  ]);
}
