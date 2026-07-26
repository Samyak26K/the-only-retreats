export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

export const videosContent: Video[] = [
  {
    id: "spiti-morning",
    title: "Morning in Spiti Valley",
    thumbnail: "/videos/spiti-morning-thumb.jpg",
    url: "https://www.youtube.com/embed/placeholder-spiti",
  },
  {
    id: "herding-traditions",
    title: "Traditions of Herding",
    thumbnail: "/videos/herding-traditions-thumb.jpg",
    url: "https://www.youtube.com/embed/placeholder-herding",
  },
  {
    id: "honey-harvest",
    title: "The Honey Harvest",
    thumbnail: "/videos/honey-harvest-thumb.jpg",
    url: "https://www.youtube.com/embed/placeholder-honey",
  },
];
