import { useState, useCallback, useEffect, useRef } from "react";
import RevealOnScroll from "./RevealOnScroll";
import SplitText from "./SplitText";
import place1 from "@/assets/place-1.jpg";
import place2 from "@/assets/place-2.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const bgImages = [place1, place2, heroBg];

interface FormData {
  fullName: string;
  email: string;
  company: string;
  budget: string;
  details: string;
  agreed: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  company?: string;
  details?: string;
  agreed?: string;
}

const AdmissionForm = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const [form, setForm] = useState<FormData>({
    fullName: "", email: "", company: "", budget: "", details: "", agreed: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const speed = hovering ? 1500 : 4000;
    intervalRef.current = setInterval(() => {
      setBgIndex((p) => (p + 1) % bgImages.length);
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [hovering]);

  const validate = useCallback((): FormErrors => {
    const e: FormErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.company.trim()) e.company = "Company is required";
    if (!form.details.trim() || form.details.trim().length < 10) e.details = "Please describe your project (min 10 chars)";
    if (!form.agreed) e.agreed = "You must agree to proceed";
    return e;
  }, [form]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  }, [validate]);

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((p) => { const n = { ...p }; delete n[field as keyof FormErrors]; return n; });
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "rgba(var(--c-navy-rgb), 0.5)",
    border: "1px solid rgba(var(--c-white-rgb), 0.06)",
    borderRadius: "var(--radius)",
    padding: "0.75rem 1rem",
    color: "var(--c-white)",
    fontFamily: "var(--font-body)",
    fontSize: "0.85rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.5s var(--f-cubic), box-shadow 0.5s var(--f-cubic)",
    backdropFilter: "blur(10px)",
  };

  const errorStyle: React.CSSProperties = { ...inputStyle, borderColor: "rgba(var(--c-rose-rgb), 0.4)" };

  if (submitted) {
    return (
      <section id="contact" className="relative overflow-hidden" style={{
        backgroundColor: "var(--c-black)",
        paddingTop: "clamp(8rem, 16vh, 14rem)",
        paddingBottom: "clamp(8rem, 16vh, 14rem)",
      }}>
        <div className="relative z-10 text-center" style={{ margin: `0 var(--g-margin)` }}>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)]" style={{ color: "var(--c-white)" }}>
            <SplitText>Message Received</SplitText>
          </h2>
          <p className="text-sm mt-6" style={{ color: "rgba(var(--c-white-rgb), 0.35)" }}>
            Thank you for reaching out. I'll respond within 24 hours.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative overflow-hidden" style={{
      backgroundColor: "var(--c-black)",
      paddingTop: "clamp(5rem, 12vh, 10rem)",
      paddingBottom: "clamp(5rem, 12vh, 10rem)",
    }}>
      {bgImages.map((img, i) => (
        <div key={i} className="absolute inset-0 z-0 transition-opacity duration-[1.5s]" style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: i === bgIndex ? 0.04 : 0,
          transitionTimingFunction: "var(--f-cubic)",
        }} />
      ))}

      <div className="relative z-10" style={{ margin: `0 var(--g-margin)` }}>
        <RevealOnScroll className="mb-12">
          <p className="text-[0.6rem] uppercase tracking-[0.25em]" style={{ color: "rgba(var(--c-yellow-rgb), 0.35)" }}>Get in Touch</p>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] mt-4" style={{ color: "var(--c-white)" }}>
            <SplitText>Start a Project</SplitText>
          </h2>
        </RevealOnScroll>

        <form onSubmit={handleSubmit} className="max-w-2xl"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: "rgba(var(--c-white-rgb), 0.25)" }}>Your Name</label>
              <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
                style={errors.fullName ? errorStyle : inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(var(--c-yellow-rgb), 0.25)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(var(--c-yellow-rgb), 0.05)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.fullName ? "rgba(var(--c-rose-rgb), 0.4)" : "rgba(var(--c-white-rgb), 0.06)"; e.currentTarget.style.boxShadow = "none"; }}
                placeholder="Marriam Tahir" />
              {errors.fullName && <span className="text-[0.65rem]" style={{ color: "rgba(var(--c-rose-rgb), 0.7)" }}>{errors.fullName}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: "rgba(var(--c-white-rgb), 0.25)" }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                style={errors.email ? errorStyle : inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(var(--c-yellow-rgb), 0.25)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(var(--c-yellow-rgb), 0.05)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "rgba(var(--c-rose-rgb), 0.4)" : "rgba(var(--c-white-rgb), 0.06)"; e.currentTarget.style.boxShadow = "none"; }}
                placeholder="hello@example.com" />
              {errors.email && <span className="text-[0.65rem]" style={{ color: "rgba(var(--c-rose-rgb), 0.7)" }}>{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: "rgba(var(--c-white-rgb), 0.25)" }}>Company</label>
              <input type="text" value={form.company} onChange={(e) => update("company", e.target.value)}
                style={errors.company ? errorStyle : inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(var(--c-yellow-rgb), 0.25)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(var(--c-yellow-rgb), 0.05)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.company ? "rgba(var(--c-rose-rgb), 0.4)" : "rgba(var(--c-white-rgb), 0.06)"; e.currentTarget.style.boxShadow = "none"; }}
                placeholder="Your company" />
              {errors.company && <span className="text-[0.65rem]" style={{ color: "rgba(var(--c-rose-rgb), 0.7)" }}>{errors.company}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: "rgba(var(--c-white-rgb), 0.25)" }}>Budget Range</label>
              <input type="text" value={form.budget} onChange={(e) => update("budget", e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(var(--c-yellow-rgb), 0.25)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(var(--c-yellow-rgb), 0.05)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(var(--c-white-rgb), 0.06)"; e.currentTarget.style.boxShadow = "none"; }}
                placeholder="$5k - $50k+" />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <label className="text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: "rgba(var(--c-white-rgb), 0.25)" }}>Project Details</label>
            <textarea value={form.details} onChange={(e) => update("details", e.target.value)}
              rows={4}
              style={{ ...(errors.details ? errorStyle : inputStyle), resize: "vertical", minHeight: "100px" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(var(--c-yellow-rgb), 0.25)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(var(--c-yellow-rgb), 0.05)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.details ? "rgba(var(--c-rose-rgb), 0.4)" : "rgba(var(--c-white-rgb), 0.06)"; e.currentTarget.style.boxShadow = "none"; }}
              placeholder="Tell me about your vision, goals, and timeline..." />
            {errors.details && <span className="text-[0.65rem]" style={{ color: "rgba(var(--c-rose-rgb), 0.7)" }}>{errors.details}</span>}
          </div>

          <div className="flex items-start gap-3 mt-6">
            <button type="button" onClick={() => update("agreed", !form.agreed)}
              className="w-4 h-4 mt-0.5 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all duration-500"
              style={{
                borderColor: errors.agreed ? "rgba(var(--c-rose-rgb), 0.4)" : form.agreed ? "rgba(var(--c-yellow-rgb), 0.5)" : "rgba(var(--c-white-rgb), 0.12)",
                backgroundColor: form.agreed ? "rgba(var(--c-yellow-rgb), 0.12)" : "transparent",
              }}>
              {form.agreed && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="var(--c-yellow)" strokeWidth="1.5" /></svg>}
            </button>
            <p className="text-[0.7rem] leading-relaxed" style={{ color: "rgba(var(--c-white-rgb), 0.25)" }}>
              I agree to the <span className="underline cursor-pointer" style={{ color: "rgba(var(--c-yellow-rgb), 0.4)" }}>privacy policy</span> and NDA terms.
            </p>
          </div>
          {errors.agreed && <span className="text-[0.65rem] ml-7 block mt-1" style={{ color: "rgba(var(--c-rose-rgb), 0.7)" }}>{errors.agreed}</span>}

          <div className="mt-8">
            <button type="submit" className="oa-button oa-button-big" style={{ maxWidth: "320px" }}>
              <span>Send Inquiry</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdmissionForm;
