
export const Footer = () => {
  return (
    <footer className="container-custom py-6 sm:py-8 md:py-10 lg:py-12 bg-gradient-to-b from-[#F7F5F3] to-[#E7F0FD] px-4 sm:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10">
        <div>
          <h4 className="font-semibold text-primary-foreground mb-2 md:mb-3 lg:mb-4 text-sm sm:text-base">Hearth</h4>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-[#9b87f5]">About Us</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Careers</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-2 md:mb-3 lg:mb-4 text-sm sm:text-base">Product</h4>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-[#9b87f5]">Features</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Pricing</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Testimonials</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-2 md:mb-3 lg:mb-4 text-sm sm:text-base">Resources</h4>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-[#9b87f5]">Blog</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Research</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Help Center</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-2 md:mb-3 lg:mb-4 text-sm sm:text-base">Connect</h4>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-[#9b87f5]">Twitter</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Instagram</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs sm:text-sm text-muted-foreground border-t border-[#9b87f5]/10 pt-4 sm:pt-6 md:pt-8">
        <p>&copy; {new Date().getFullYear()} Hearth. All rights reserved.</p>
      </div>
    </footer>
  );
};
