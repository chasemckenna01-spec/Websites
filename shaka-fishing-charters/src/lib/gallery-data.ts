// PLACEHOLDER gallery entries. Replace `gradient` tiles with real photos —
// add images to /public/gallery and swap the tile rendering in
// gallery-grid.tsx to use next/image with these captions.

export type GalleryItem = {
  id: string;
  caption: string;
  category: "Catch" | "On Board" | "Sunset" | "Crew";
  gradient: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    caption: "Mahi-mahi catch, offshore charter",
    category: "Catch",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #2dd4bf 100%)",
  },
  {
    id: "g2",
    caption: "Trolling past the West Maui Mountains",
    category: "On Board",
    gradient: "linear-gradient(135deg, #062033 0%, #0c4a6e 60%, #14a5c9 100%)",
  },
  {
    id: "g3",
    caption: "Full Day Experience — cooking the catch",
    category: "Sunset",
    gradient: "linear-gradient(135deg, #831843 0%, #db2777 55%, #f9a8d4 100%)",
  },
  {
    id: "g4",
    caption: "Captain Chase at the helm",
    category: "Crew",
    gradient: "linear-gradient(135deg, #0e7490 0%, #0c4a6e 100%)",
  },
  {
    id: "g5",
    caption: "Ahi tuna, deep water run",
    category: "Catch",
    gradient: "linear-gradient(135deg, #164e63 0%, #0891b2 50%, #5eead4 100%)",
  },
  {
    id: "g6",
    caption: "Guide Casimiri rigging tackle",
    category: "Crew",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #2dd4bf 100%)",
  },
  {
    id: "g7",
    caption: "Sunset return to Lahaina Harbor",
    category: "Sunset",
    gradient: "linear-gradient(135deg, #581c87 0%, #db2777 50%, #fbbf24 100%)",
  },
  {
    id: "g8",
    caption: "Guests reeling in a group catch",
    category: "On Board",
    gradient: "linear-gradient(135deg, #075985 0%, #0ea5e9 60%, #7dd3fc 100%)",
  },
  {
    id: "g9",
    caption: "Fresh catch, dinner service on deck",
    category: "Sunset",
    gradient: "linear-gradient(135deg, #6b21a8 0%, #c026d3 55%, #fcd34d 100%)",
  },
];
