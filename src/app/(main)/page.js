import AdvertisementSection from "@/components/shared/AdvertisementSection";
import AboutTicketix from "@/components/shared/AboutTicketix";
import BookingProcess from "@/components/shared/BookingProcess";
import HeroSlider from "@/components/shared/Hero";
import InteractiveDestinations from "@/components/shared/InteractiveDestinations";
import MobileAppPromo from "@/components/shared/MobileAppPromo";
import ProfessionalServices from "@/components/shared/ProfessionalServices";
import LatestSection from "@/components/shared/LatestSection";
import WhyChooseUs from "@/components/shared/WhyChoseUs";
import PopularRoutes from "@/components/shared/PopularRoutes";

export default function Home() {
  return (
    <div className="mt-16">
      <HeroSlider/>
      <AdvertisementSection/>
      <LatestSection/>
      <AboutTicketix/>
      <BookingProcess/>
      <PopularRoutes/>
      <MobileAppPromo/>
      <WhyChooseUs/>
      <ProfessionalServices/>
    </div>
  );
}
