import { PlayCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { SITE, VIDEOS } from "@/data/site";
import heroClassroom from "@/assets/hero-classroom.jpg";
import heroStudents from "@/assets/hero-students.jpg";
import heroStudy from "@/assets/hero-study.jpg";
import aboutTeaching from "@/assets/about-teaching.jpg";

const COVERS = [heroClassroom, heroStudents, heroStudy, aboutTeaching];

export function Videos() {
  return (
    <>
      <PageHero title="Video Library" subtitle="Watch our classrooms, toppers and campus stories." crumbs={[{ label: "Videos" }]} />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Watch" title="Stories from Gurukul" />
          <div className="grid sm:grid-cols-2 gap-8">
            {VIDEOS.map((video, index) => (
              <div key={video.title} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                <div className="relative aspect-video overflow-hidden">
                  <img src={COVERS[index % COVERS.length]} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-brand-ink/40 flex items-center justify-center">
                    <a href={SITE.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label={`Open ${video.title}`} className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB] shadow-card transition-transform group-hover:scale-105">
                      <PlayCircle className="h-8 w-8 text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-brand-ink">{video.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
