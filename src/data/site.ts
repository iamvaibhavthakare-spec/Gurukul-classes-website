import type { LucideIcon } from "lucide-react";
import {
  Atom, FlaskConical, Microscope, Rocket, Brain, Stethoscope, GraduationCap, BookOpen,
} from "lucide-react";

export const SITE = {
  name: "Gurukul Science Classes",
  shortName: "Gurukul",
  tagline: "IIT-JEE | Medical | Foundation Coaching",
  email: "gurukulclasses2@gmail.com",
  primaryPhone: "+91 9820363807",
  primaryPhoneRaw: "+919820363807",
  whatsapp: "919820363807",
  socials: {
    facebook: "https://www.facebook.com/GurukulScienceClasses",
    instagram: "https://www.instagram.com/gurukulscienceclasses/",
    youtube: "https://www.youtube.com/@gurukulscienceclasses1866",
  },
};

export interface Branch {
  slug: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  phoneRaw: string;
  mapUrl?: string;
  badge?: string;
}

export const BRANCHES: Branch[] = [
  {
    slug: "sahajanand-chowk",
    name: "Sahajanand Chowk HO",
    area: "Kalyan (W)",
    address:
      "2nd Floor, Yadnyavalkya Bld, Sahajanand Chowk, Agra Road, Kalyan (W) 421301",
    phone: "+91 9833036464",
    phoneRaw: "+919833036464",
    mapUrl:
      "https://www.google.com/maps/place/Gurukul+science+classes,+Yadnyavalkya+hall,+Sahjanand+Chowk,+Kalyan,+Maharashtra+421301/data=!4m2!3m1!1s0x3be795b3b17e78ed:0xf37353c315d0dec2!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI2LjIzLjEYACCenQoqiwEsOTQyNjc3MjcsOTQyOTIxOTUsOTQyOTk1MzIsMTAwNzk2NDk4LDEwMDc5Nzc2MSwxMDA3OTY1MzUsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTksMTAwODE1NjM1QgJJTg%3D%3D&skid=d6c24800-81f4-487e-9672-91ada59aad7a&g_st=aw",
    badge: "Head Office",
  },
  {
    slug: "khadakpada",
    name: "Khadakpada Branch",
    area: "Kalyan (W)",
    address:
      "G Wing, Vrindavan Palm, Near Arati Nagari, Wayle Nagar, Khadakpada, Behind Union Bank of India, Kalyan (W) 421301",
    phone: "+91 9594366464",
    phoneRaw: "+919594366464",
    mapUrl:
      "https://www.google.com/maps/place/Gurukul+Science+Classes/data=!4m2!3m1!1s0x0:0x9000ae4dc07b864b?sa=X&ved=1t:2428&ictx=111",
  },
  {
    slug: "dhamankar-naka",
    name: "Dhamankar Naka Branch",
    area: "Bhiwandi",
    address:
      "2nd Floor, Laxmi Vishnu Complex, Near Post Office, B.N.N College Road, Dhamankar Naka, Bhiwandi",
    phone: "+91 9594066464",
    phoneRaw: "+919594066464",
    mapUrl:
      "https://www.google.com/maps/place/Gurukul+science+class+bhiwandi+गुरुकुल+सायन्स+क्लास+भिवंडी/@19.2874427,73.0551285,931m/data=!3m1!1e3!4m5!3m4!1s0x3be7bd84135deda3:0x305c71f62d3c501c!8m2!3d19.2874436!4d73.0551285!5m1!1e1!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    slug: "mandai",
    name: "Mandai Branch",
    area: "Bhiwandi",
    address:
      "1st Floor, Gokhani Complex, Navi Chawl, Opp Memsaab Collection, Above Bharat Gas, Mandai Road, Bhiwandi",
    phone: "+91 9833056464",
    phoneRaw: "+919833056464",
    mapUrl: "https://maps.app.goo.gl/nbtY7FVsDZPoQwah9",
  },
  {
    slug: "anjurphata",
    name: "Anjurphata Branch",
    area: "Bhiwandi",
    address:
      "Shop No. 12, Ground Floor, Atlanta Luxuria, Opp. Oswal College & School, Kamatghar Road, Anjurphata, Bhiwandi",
    phone: "+91 9833866464",
    phoneRaw: "+919833866464",
    mapUrl: "https://goo.gl/maps/HS1TZmx1igrfkaLi7",
  },
];

export interface Course {
  slug: string;
  path: string;
  title: string;
  short: string;
  description: string;
  subjects: string[];
  icon: LucideIcon;
  tone: "red" | "yellow" | "orange" | "deep";
  category: "School" | "College" | "Entrance";
  highlights: string[];
  duration?: string;
  schedule?: string;
  included?: string[];
}

export const COURSES: Course[] = [
  {
    slug: "viii-ssc-cbse",
    path: "/courses/viii-ssc-cbse",
    title: "VIII SSC / CBSE",
    short: "Foundation builder for Class 8 students",
    description:
      "An early-foundation programme that turns curiosity into clarity. Concept-first teaching, periodic assessments, and structured doubt-solving prepare Class 8 students for the years ahead.",
    subjects: ["Mathematics", "Science", "English", "Mental Ability"],
    icon: BookOpen,
    tone: "yellow",
    category: "School",
    highlights: [
      "Concept-based foundation curriculum",
      "Weekly tests with detailed reports",
      "Olympiad & scholarship exam guidance",
      "Parent–teacher engagement sessions",
    ],
  },
  {
    slug: "ix-ssc-cbse",
    path: "/courses/ix-ssc-cbse",
    title: "IX SSC / CBSE",
    short: "Strong groundwork for boards & Entrance",
    description:
      "A focused Class 9 programme that sharpens fundamentals in Math and Science while integrating early exposure to NEET / JEE-style reasoning.",
    subjects: ["Mathematics", "Science", "English", "Social Science"],
    icon: Atom,
    tone: "orange",
    category: "School",
    highlights: [
      "NCERT mastery + advanced practice",
      "Foundation for IIT-JEE / NEET reasoning",
      "Regular mock tests & analysis",
      "Personal mentor allocation",
    ],
  },
  {
    slug: "x-ssc-cbse",
    path: "/courses/x-ssc-cbse",
    title: "X SSC / CBSE",
    short: "Board excellence + Entrance head-start",
    description:
      "A dual-track Class 10 programme that delivers consistent board performance and a strong head-start for XI Science, JEE & NEET foundations.",
    subjects: ["Algebra", "Geometry", "Science I & II", "English"],
    icon: GraduationCap,
    tone: "red",
    category: "School",
    highlights: [
      "Board-pattern + Entrance-pattern teaching",
      "Chapter-wise tests & periodic exams",
      "Doubt-solving every day",
      "Career & stream guidance",
    ],
  },
  {
    slug: "xi-science",
    path: "/courses/xi-science",
    title: "XI Science",
    short: "PCMB excellence for the new senior secondary",
    description:
      "An integrated XI Science programme aligning HSC syllabus with JEE / NEET / MH-CET preparation — no compromise on either side.",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    icon: FlaskConical,
    tone: "deep",
    category: "College",
    highlights: [
      "Integrated HSC + Entrance modules",
      "Top faculty for PCMB",
      "Daily Practice Problems (DPP)",
      "Performance dashboard",
    ],
  },
  {
    slug: "xii-science",
    path: "/courses/xii-science",
    title: "XII Science",
    short: "Final-year sprint for board + Entrance",
    description:
      "The decisive year — sharpened revision, full-syllabus mock tests, and Entrance-grade rigour to maximise scores in HSC, JEE, NEET, MH-CET.",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    icon: Brain,
    tone: "red",
    category: "College",
    highlights: [
      "Weekly full-syllabus mock tests",
      "Past-year question marathons",
      "Strategy & time-management drills",
      "Personalised improvement plans",
    ],
  },
  {
    slug: "mh-cet",
    path: "/courses/mh-cet",
    title: "MH-CET",
    short: "State-level engineering & pharmacy Entrance",
    description:
      "Maharashtra CET focused coaching with state-board aligned strategy, speed-and-accuracy drills, and CET-pattern mock tests.",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    icon: Rocket,
    tone: "orange",
    category: "Entrance",
    highlights: [
      "Maharashtra board aligned",
      "Speed and accuracy training",
      "Negative-marking strategy",
      "Sectional + full mock tests",
    ],
  },
  {
    slug: "neet",
    path: "/courses/neet",
    title: "NEET",
    short: "Medical Entrance — the doctor's path",
    description:
      "Comprehensive NEET coaching by senior medical-Entrance faculty, with NCERT mastery, biology micro-concept drills, and full-length test series.",
    subjects: ["Physics", "Chemistry", "Botany", "Zoology"],
    icon: Stethoscope,
    tone: "deep",
    category: "Entrance",
    highlights: [
      "NCERT line-by-line mastery",
      "Biology micro-concept videos",
      "AIIMS-style problem solving",
      "All-India test series",
    ],
  },
  {
    slug: "iit-jee",
    path: "/courses/iit-jee",
    title: "IIT-JEE",
    short: "JEE Main & Advanced — the engineering dream",
    description:
      "JEE Main + Advanced focused programme with IIT-grade problem solving, conceptual depth, and a competitive peer environment.",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    icon: Microscope,
    tone: "red",
    category: "Entrance",
    highlights: [
      "Advanced problem-solving sessions",
      "JEE Main + Advanced track",
      "Olympiad-level enrichment",
      "Top-rank mentorship",
    ],
  },
];

export const COURSE_BY_SLUG: Record<string, Course> =
  Object.fromEntries(COURSES.map((c) => [c.slug, c]));

export const STATS = [
  { value: 10000, suffix: "+", label: "Successful Students" },
  { value: 6000, suffix: "+", label: "In Top Colleges" },
  { value: 25, suffix: "+", label: "Years of Trust" },
  { value: 5, suffix: "", label: "Kalyan & Bhiwandi" },
];

export const WHY_CHOOSE = [
  {
    title: "Expert Faculty",
    text: "Senior IIT-JEE, NEET, MH-CET faculty with decades of result-oriented teaching experience.",
  },
  {
    title: "Integrated Programs",
    text: "Seamless integration of board syllabus with Entrance preparation — no double burden.",
  },
  {
    title: "Excellent Study Material",
    text: "Concept-first booklets, DPPs and chapter-wise question banks built by the academic team.",
  },
  {
    title: "Doubt Solving Session",
    text: "Dedicated doubt-clearing sessions, walk-in mentoring and one-on-one academic counseling.",
  },
  {
    title: "Regular Tests",
    text: "Weekly, monthly and full-syllabus tests modelled on the latest exam patterns.",
  },
  {
    title: "Result Track Record",
    text: "Thousands of students placed in top medical, engineering and science colleges every year.",
  },
];

export const METHODOLOGY = [
  { step: "01", title: "Diagnostic Assessment", text: "Map every student's strengths and gaps before the journey begins." },
  { step: "02", title: "Concept Lectures", text: "Senior faculty deliver concept-first lectures with real-life examples." },
  { step: "03", title: "Practice & DPPs", text: "Daily Practice Problems lock in concepts and build problem-solving speed." },
  { step: "04", title: "Periodic Testing", text: "Chapter, monthly, prelim and full-syllabus tests modelled on actual exams." },
  { step: "05", title: "Doubt Sessions", text: "Walk-in doubt solving and one-on-one mentoring throughout the year." },
  { step: "06", title: "Performance Review", text: "Detailed analytics shared with students and parents for course-correction." },
];

export const TESTIMONIALS = [
  { name: "Ananya Sharma", role: "NEET Aspirant, Kalyan", text: "The biology mentoring at Gurukul changed how I approach NCERT. Daily DPPs and weekly tests built my confidence." },
  { name: "Rohit Patil", role: "IIT-JEE 2024, Bhiwandi", text: "The JEE faculty pushed me beyond textbook problems. Without their problem-solving sessions I wouldn't have cracked Advanced." },
  { name: "Mrs. Deshpande", role: "Parent, Class XII", text: "Regular parent updates and a sincere mentor team — Gurukul felt like a true partner in my daughter's preparation." },
  { name: "Saanvi Kulkarni", role: "MH-CET Topper", text: "The CET-pattern mock tests and speed drills made me exam-ready months in advance. Highly recommended." },
  { name: "Aarav Joshi", role: "XI Science Student", text: "Best integrated programme in Kalyan. I never feel boards and Entrance are two different things anymore." },
  { name: "Prisha Nair", role: "Class X Student", text: "Chapter tests and correction sessions helped me understand exactly where I was losing marks." },
  { name: "Mr. Kulkarni", role: "Parent, IX Foundation", text: "The regular updates gave us confidence that our child was building habits, not just attending classes." },
  { name: "Devansh Shah", role: "JEE Main Aspirant", text: "The faculty explained difficult physics problems step by step and made revision feel manageable." },
  { name: "Ira More", role: "XII Science Student", text: "The test schedule kept me consistent through the year and helped me prepare for boards and CET together." },
];

export const RESULTS = [
  { name: "Aarav S.", exam: "NEET 2024", score: "682 / 720", college: "Govt. Medical College" },
  { name: "Ishika M.", exam: "JEE Advanced 2024", score: "AIR 2,184", college: "IIT Bombay" },
  { name: "Riya P.", exam: "MH-CET 2024", score: "99.87 %ile", college: "VJTI Mumbai" },
  { name: "Kabir T.", exam: "JEE Main 2024", score: "99.6 %ile", college: "NIT Surathkal" },
  { name: "Saanvi K.", exam: "NEET 2024", score: "656 / 720", college: "Grant Medical College" },
  { name: "Vivaan R.", exam: "HSC Science 2024", score: "94.50 %", college: "Mithibai College" },
  { name: "Anika D.", exam: "MH-CET 2024", score: "99.71 %ile", college: "COEP Pune" },
  { name: "Rudra J.", exam: "JEE Advanced 2024", score: "AIR 4,902", college: "IIT Madras" },
];

export const GALLERY_PROMPTS = [
  "Modern classroom with engaged Indian students",
  "Award ceremony for toppers",
  "Science laboratory practical session",
  "Doubt solving with teacher",
  "Felicitation event for parents and students",
  "Group photo of top rankers",
];

export const PRESS = [
  { date: "Mar 2025", title: "Gurukul students sweep MH-CET 2024 top ranks", excerpt: "More than 80% of our XII Science batch crossed the 95-percentile mark in MH-CET 2024." },
  { date: "Jan 2025", title: "New Anjurphata centre inaugurated in Bhiwandi", excerpt: "Our fifth branch opens its doors with state-of-the-art classrooms and a dedicated test centre." },
  { date: "Aug 2024", title: "Felicitation of NEET & JEE 2024 toppers", excerpt: "A celebratory evening honouring 120+ students who secured admissions in top medical and engineering colleges." },
  { date: "Jun 2024", title: "Gurukul launches integrated Foundation programme", excerpt: "A redesigned VIII–X foundation track focused on concept building and early competitive exposure." },
];


export const COURSE_OPTIONS = COURSES.map((c) => c.title);
export const BRANCH_OPTIONS = BRANCHES.map((b) => `${b.name} — ${b.area}`);
