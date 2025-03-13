
export const FeaturedSection = () => {
  return (
    <section className="container-custom py-8 sm:py-10 md:py-12 lg:py-16 bg-gradient-to-b from-[#F1F0FB] to-[#F7F5F3] px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-foreground mb-3 sm:mb-4 md:mb-6">
          Featured In
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          Hearth has been recognized by leading publications for its innovative approach to mental wellness
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
        {['Forbes', 'TechCrunch', 'Wired', 'Fast Company', 'Psychology Today'].map((name) => (
          <div key={name} className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-300 hover:text-gray-500 transition-colors duration-300">
            {name}
          </div>
        ))}
      </div>
    </section>
  );
};
