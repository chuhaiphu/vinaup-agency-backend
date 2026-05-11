export interface MarqueeSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Marquee {
  slides: MarqueeSlide[];
}
