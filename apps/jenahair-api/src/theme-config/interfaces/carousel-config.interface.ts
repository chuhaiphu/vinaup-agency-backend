export interface CarouselSlide {
    id: string | number;
    imageUrl: string;
    href?: string;
    title?: string;
    subTitle?: string;
}

export interface Carousel {
    slides: CarouselSlide[];
}
