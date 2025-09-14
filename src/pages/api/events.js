// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      name: "The Global Tour",
      location: "London, UK",
      date: "2025-11-20",
    },
    {
      id: 2,
      name: "Acoustic Night",
      location: "Paris, France",
      date: "2025-12-05",
    },
    {
      id: 3,
      name: "Festival of Music",
      location: "New York, USA",
      date: "2026-01-15",
    },
    {
      id: 4,
      name: "Festival of Music",
      location: "New York, USA",
      date: "2025-11-15",
    },
    {
      id: 5,
      name: "Festival of Music",
      location: "New York, USA",
      date: "2026-04-25",
    },
  ]);
}
