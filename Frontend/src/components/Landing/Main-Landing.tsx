import { Hero } from "./Hero";
import { Footer } from "./Footer";
// import { Team } from "./Team";
import { Features } from "./Features";
import { Navbar } from "../Navbar";
import {Home} from 'lucide-react'

export function MainLanding() {
  return (
    <div>
      <div className="absolute w-full rounded-none">
        <Navbar title="Edu-Play" icon={Home} />
      </div>
      <Hero />
      <Features />
      {/* <Team /> */}
      {/* <Testimonials /> */}
      <Footer />
    </div>
  );
}