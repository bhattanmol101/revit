import { title } from "@/components/primitives";

export default function ContactPage() {
  return (
    <div className="h-[70vh]">
      <div className="text-center">
        <h1 className={`${title({ size: "sm", color: "blue" })}`}>
          Contact Us
        </h1>
      </div>
      <h4 className="md:pt-24 pt-12">
        As we are a small team please expect some delay in response. We will try
        our best to revert back as soon as possible.
      </h4>
      <div>
        <h4 className="md:pt-16 pt-8 pb-4 font-bold">Email-Id</h4>
        <p className="text-sm">aeradron@gmail.com</p>
      </div>
      <div>
        <h4 className="md:pt-16 pt-8 pb-4 font-bold">Address</h4>
        <p className="text-sm">
          MCN Residency, 1st Cross Vaikuntum Layout, Kundanahalli, Bangalore,
          Karnataka - 560037
        </p>
      </div>
      <div>
        <h4 className="md:pt-16 pt-8 pb-4 font-bold">Contact Number</h4>
        <p className="text-sm">7899270142 / 9742870166</p>
      </div>
    </div>
  );
}
