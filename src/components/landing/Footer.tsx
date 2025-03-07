
export const Footer = () => {
  return (
    <footer className="container-custom py-8 md:py-12 bg-gradient-to-b from-[#F7F5F3] to-[#E7F0FD]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-10">
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3 md:mb-4">Hearth</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-[#9b87f5]">About Us</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Careers</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3 md:mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-[#9b87f5]">Features</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Pricing</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Testimonials</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3 md:mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-[#9b87f5]">Blog</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Research</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Help Center</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3 md:mb-4">Connect</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-[#9b87f5]">Twitter</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Instagram</a></li>
            <li><a href="#" className="hover:text-[#9b87f5]">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm text-muted-foreground border-t border-[#9b87f5]/10 pt-6 md:pt-8">
        <p>&copy; {new Date().getFullYear()} Hearth. All rights reserved.</p>
      </div>
    </footer>
  );
};
