import { useEffect, useState } from "react";
import { ArrowRight, Phone, Sparkles, Star } from "lucide-react";
import { AppLink } from "@/components/AppLink";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";
import { useHeroSlides } from "@/hooks/use-public-content";

export function HeroCarousel() {
  const { slides } = useHeroSlides();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length === 0) {
      return;
    }
    setI((current) => current % slides.length);
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[i] ?? slides[0];
  const primaryButtonLink = slide?.buttonLink || "#enquire";
  const primaryButtonText = slide?.buttonText || "Enquire Now";

  return (
    <section className="relative overflow-hidden bg-brand-ink min-h-[560px] lg:min-h-[580px]">
      {slides.map((s, idx) => (
        <div
          key={`${s.title}-${idx}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === idx ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            src={s.image}
            alt={s.title}
            className="h-full w-full object-cover scale-105 brightness-[0.9] saturate-[0.65]"
            loading={idx === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-brand-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/85 via-brand-ink/45 to-brand-ink/10" />
        </div>
      ))}

      <div className="relative mx-auto grid min-h-[560px] w-full max-w-[1500px] items-center gap-10 px-4 py-16 sm:px-6 lg:min-h-[580px] lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-16 2xl:px-14">
        <div key={i} className="text-white animate-slide-in-left">
          <span className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase">
            <Sparkles className="h-3.5 w-3.5 text-brand-yellow" /> {slide?.subtitle}
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight">
            {slide?.title}
          </h1>
          <p className="mt-5 text-lg text-white/85 max-w-xl">{slide?.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {primaryButtonLink.startsWith("#") ? (
              <a
                href={primaryButtonLink}
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-white shadow-glow"
              >
                {primaryButtonText} <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <AppLink
                to={primaryButtonLink}
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-white shadow-glow"
              >
                {primaryButtonText} <ArrowRight className="h-4 w-4" />
              </AppLink>
            )}
            <AppLink
              to="/courses/xi-science"
              className="inline-flex items-center gap-2 rounded-full bg-white/95 px-6 py-3 text-sm font-bold text-brand-ink hover:bg-brand-yellow transition-colors"
            >
              View Courses
            </AppLink>
            <a
              href={`tel:${SITE.primaryPhoneRaw}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white hover:text-brand-ink transition-colors"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {["10,000+ Students", "5 Branches", "25+ Years of Trust"].map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-2 rounded-2xl glass-card px-4 py-2 text-xs font-semibold text-white"
              >
                <Star className="h-3.5 w-3.5 text-brand-yellow" /> {b}
              </span>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:flex justify-end">
          <div key={`img-${i}`} className="relative w-full max-w-[560px] animate-slide-in-right">
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white/40 shadow-card">
              <img
                src={slide?.image}
                alt={slide?.title}
                width={680}
                height={460}
                className="h-[430px] w-full object-cover brightness-[0.94] saturate-[0.58]"
              />
            </div>
            <div className="absolute -left-8 top-10 rounded-2xl glass-card px-5 py-4 text-sm font-bold text-brand-ink shadow-card animate-float">
              <div className="text-brand-red text-xs uppercase tracking-wider">Topper</div>
              99.87 %ile MH-CET
            </div>
            <div
              className="absolute -right-6 bottom-16 rounded-2xl bg-brand-yellow px-5 py-4 text-sm font-bold text-brand-ink shadow-yellow animate-float"
              style={{ animationDelay: "1.2s" }}
            >
              {slide?.badge}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === idx ? "w-10 bg-gradient-brand" : "w-4 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}
