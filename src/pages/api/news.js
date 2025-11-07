// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      description: "solomons garden - welcome to the garden",
      link: "#",
      image: "https://f4.bcbits.com/img/a3830138749_10.jpg",
    },
    {
      id: 2,
      description: "nyashe munashe - fini ep",
      link: "#",
      image:
        "/images/564202444_18533715448034768_5754189584800487764_nyashe_fini.jpg",
    },
    {
      id: 3,
      description: "solomons garden - how did we get here",
      link: "#",
      image:
        "https://sweetsoulshop.com/cdn/shop/products/Solomons_Garden_HDWGH_jacket.jpg",
    },
  ]);
}
