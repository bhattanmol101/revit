import { Divider } from "@heroui/divider";

function Footer() {
  return (
    <footer>
      <Divider />
      <div className="flex flex-row justify-between items-start md:px-36 px-5 py-8 text-default-400 text-small">
        <div className="flex flex-col md:gap-3 gap-1">
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>
        <div className="flex flex-col md:gap-3 gap-1">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>
      </div>
      <div className="w-full flex items-center justify-center py-3">
        <span className="text-default-600">Powered by</span>
        <p className="text-primary text-lg pl-1">aeradron</p>
      </div>
    </footer>
  );
}

export default Footer;
