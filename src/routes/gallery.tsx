import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import heroClassroom from "@/assets/hero-classroom.jpg";
import heroStudents from "@/assets/hero-students.jpg";
import heroStudy from "@/assets/hero-study.jpg";
import aboutTeaching from "@/assets/about-teaching.jpg";

const IMAGES = [
  { src: heroClassroom, caption: "Science Lab Session" },
  { src: heroStudents, caption: "Felicitation Ceremony 2024" },
  { src: aboutTeaching, caption: "Concept Lecture in Action" },
  { src: heroStudy, caption: "Self-Study Hours" },
  { src: heroClassroom, caption: "Practical Class" },
  { src: heroStudents, caption: "Topper Awards 2024" },
  { src: aboutTeaching, caption: "Doubt-Solving Hours" },
  { src: heroStudy, caption: "Library Session" },
  { src: heroClassroom, caption: "Foundation Batch" },
];

export function Gallery() {
  return (
    <>
      <PageHero title="Campus & Events" subtitle="A glimpse into the everyday energy of Gurukul." crumbs={[{ label: "Gallery" }]} />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Moments" title="Inside Gurukul" />
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {IMAGES.map((img, index) => (
              <figure key={index} className="group break-inside-avoid overflow-hidden rounded-2xl shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                <div className="relative overflow-hidden">
                  <img src={img.src} alt={img.caption} className="w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <figcaption className="text-white text-sm font-semibold">{img.caption}</figcaption>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
