// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json([
    {
      songId: "09a52fb7-b8a6-485d-9b35-5a98849cd969",
      title: "Electronic Vibe",
      artist: "AudioJungle",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      cover: "https://placehold.co/300x300/D1D5DB/1F2937?text=Vibe",
    },
    {
      songId: "e5570de8-2ac9-4ce9-86c6-96bfc9fc0358",
      title: "Ambient Chill",
      artist: "Relaxing Tunes",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      cover: "https://placehold.co/300x300/4B5563/F9FAFB?text=Chill",
    },
    {
      songId: "5cc53f23-8265-4b48-97c4-fec5be88c0d9",
      title: "Upbeat Corporate",
      artist: "Corporate Beats",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      cover: "https://placehold.co/300x300/9CA3AF/374151?text=Upbeat",
    },
    {
      songId: "757cfd3b-1a2f-478f-8c1e-13656593c282",
      title: "Funky Groove",
      artist: "Groovy Gang",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      cover: "https://placehold.co/300x300/6B7280/D1D5DB?text=Funk",
    },
    {
      songId: "fe392e1a-8bbe-42e8-869c-f842c513acd7",
      title: "Acoustic Melody",
      artist: "Acoustic Art",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      cover: "https://placehold.co/300x300/374151/9CA3AF?text=Acoustic",
    },
  ]);
}
