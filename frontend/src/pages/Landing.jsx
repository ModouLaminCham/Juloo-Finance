import Navbar from "../components/Navbar";
import Marquee from "../components/Marquee";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div style={styles.page}>
      
      {/* NAVBAR */}
      <Navbar />

      {/* MARQUEE */}
      <Marquee />

      {/* HERO SECTION */}
      <div style={styles.heroWrapper}>
        <Hero />
      </div>

      {/* SERVICES */}
      <div style={styles.sectionWrapper}>
        <Services />
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0F172A, #1E3A8A)",
    color: "white",
  },

  /* HERO BACKGROUND IMAGE + OVERLAY */
  heroWrapper: {
    position: "relative",
    backgroundImage:
      "url('/src/assets/bank-bg.jpg')", // 🔥 add your image here
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  /* DARK OVERLAY (VERY IMPORTANT FOR READABILITY) */
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,58,138,0.8))",
  },

  /* SERVICES SECTION WRAPPER */
  sectionWrapper: {
    paddingTop: "60px",
    paddingBottom: "60px",
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(30,58,138,1))",
  },
};