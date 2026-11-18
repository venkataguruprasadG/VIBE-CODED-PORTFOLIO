import { useState, type FormEvent } from 'react';
import { Check, Copy, FileText, Mail, Phone, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { ENGINEER_PROFILE } from '../data';
import { fadeUpItem, staggerContainer } from '../lib/animations';
import { Magnetic } from './Magnetic';
import { SpotlightCard } from './SpotlightCard';

interface ContactViewProps {
  onCopyEmail: () => void;
  onNotify: (message: string) => void;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactView({ onCopyEmail, onNotify }: ContactViewProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: 'Software / IoT Engineering Opportunity',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    onCopyEmail();
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 1800);
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(ENGINEER_PROFILE.phone);
      onNotify(`Copied ${ENGINEER_PROFILE.phone}`);
    } catch {
      onNotify(`Phone: ${ENGINEER_PROFILE.phone}`);
    }
    setCopiedPhone(true);
    window.setTimeout(() => setCopiedPhone(false), 1800);
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (form.message.trim().length < 15) {
      nextErrors.message = 'Please include a brief note (at least 15 characters).';
    }
    return nextErrors;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitted(true);
    onNotify('Message validated and prepared. Thank you for reaching out.');
    setForm({
      name: '',
      email: '',
      subject: 'Software / IoT Engineering Opportunity',
      message: '',
    });
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div
        variants={fadeUpItem}
        className="border-b border-[#C3DCEF] dark:border-[#1E375C] pb-7"
      >
        <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">Get In Touch</p>
        <h1 className="mt-1.5 font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
          Contact &amp; Inquiries
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
          Available for entry-level Software Engineering, AI/ML, and IoT engineering roles as well
          as technical project collaborations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
        {/* High-Contrast Deep Navy Anchor Card with Glacier & Lemon Typography */}
        <motion.div variants={fadeUpItem} className="lg:col-span-5 flex">
          <div className="flex w-full flex-col justify-between rounded-xl border border-[#1E375C] bg-[#091933] dark:bg-[#0F2038] p-7 sm:p-8 text-[#EDF6FC] shadow-lg">
            <div>
              <p className="font-mono text-xs text-[#EFEA2B]">Direct Channels</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#EDF6FC]">
                {ENGINEER_PROFILE.name}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#9BB8D9]">
                Based in {ENGINEER_PROFILE.location}. B.Tech CSO (IoT) candidate at ACE Engineering
                College, Ghatkesar.
              </p>

              {/* Email Copy Box */}
              <div className="mt-6 rounded-lg border border-[#1E375C] bg-[#061124] p-4">
                <div className="font-mono text-[11px] text-[#9BB8D9]">Direct Email</div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="truncate font-mono text-xs sm:text-sm text-[#EDF6FC]">
                    {ENGINEER_PROFILE.email}
                  </span>
                  <Magnetic strength={0.24} maxOffset={5}>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#1E375C] bg-[#EFEA2B] px-3 py-1.5 text-xs font-semibold text-[#091933] hover:bg-[#66B3F5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFEA2B]"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </Magnetic>
                </div>
              </div>

              {/* Phone Copy Box */}
              <div className="mt-3 rounded-lg border border-[#1E375C] bg-[#061124] p-4">
                <div className="font-mono text-[11px] text-[#9BB8D9]">Phone</div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tabular-nums text-[#EDF6FC]">
                    <Phone className="h-3.5 w-3.5 text-[#66B3F5]" aria-hidden="true" />
                    <span>{ENGINEER_PROFILE.phone}</span>
                  </span>
                  <Magnetic strength={0.24} maxOffset={5}>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#1E375C] bg-[#0F2038] px-3 py-1.5 text-xs font-medium text-[#EDF6FC] hover:border-[#EFEA2B] hover:text-[#EFEA2B] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFEA2B]"
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#EFEA2B]" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>

            {/* Official Resume PDF Link */}
            <div className="mt-7 border-t border-[#1E375C] pt-5">
              <a
                href={ENGINEER_PROFILE.resumePdfUrl}
                download="Venkata_Guru_Prasad_Gummadi_Resume.pdf"
                className="flex items-center justify-between rounded-lg border border-[#1E375C] px-4 py-3 text-sm font-medium text-[#EDF6FC] hover:border-[#EFEA2B] hover:text-[#EFEA2B] transition-colors"
              >
                <span>Download Official Resume (PDF)</span>
                <FileText className="h-4 w-4 text-[#EFEA2B]" aria-hidden="true" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Interactive Message Form */}
        <motion.div variants={fadeUpItem} className="lg:col-span-7 flex">
          <SpotlightCard className="w-full p-7 sm:p-8">
            <div className="flex items-center justify-between gap-2 border-b border-[#C3DCEF] dark:border-[#1E375C] pb-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#091933] dark:text-[#EDF6FC]">
                  Send a Note
                </h2>
                <p className="text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                  Direct inquiry with client-side validation.
                </p>
              </div>
              <Mail className="h-4 w-4 text-[#3B8EE0] dark:text-[#66B3F5]" aria-hidden="true" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-[#091933] dark:text-[#EDF6FC] mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                      if (submitted) setSubmitted(false);
                    }}
                    aria-invalid={Boolean(errors.name)}
                    placeholder="Recruiter / Hiring Manager"
                    className="w-full rounded-md border border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/60 dark:bg-[#081426] px-3.5 py-2.5 text-sm text-[#091933] dark:text-[#EDF6FC] placeholder:text-[#3A5173]/60 dark:placeholder:text-[#9BB8D9]/55 focus:border-[#3B8EE0] dark:focus:border-[#F2EC38] focus:outline-none"
                  />
                  {errors.name && (
                    <p role="alert" className="mt-1.5 text-xs text-[#091933] dark:text-[#F2EC38] font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-[#091933] dark:text-[#EDF6FC] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                      if (submitted) setSubmitted(false);
                    }}
                    aria-invalid={Boolean(errors.email)}
                    placeholder="hiring@company.com"
                    className="w-full rounded-md border border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/60 dark:bg-[#081426] px-3.5 py-2.5 text-sm text-[#091933] dark:text-[#EDF6FC] placeholder:text-[#3A5173]/60 dark:placeholder:text-[#9BB8D9]/55 focus:border-[#3B8EE0] dark:focus:border-[#F2EC38] focus:outline-none"
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1.5 text-xs text-[#091933] dark:text-[#F2EC38] font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-medium text-[#091933] dark:text-[#EDF6FC] mb-1.5"
                >
                  Topic
                </label>
                <select
                  id="contact-subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-md border border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/60 dark:bg-[#081426] px-3.5 py-2.5 text-sm text-[#091933] dark:text-[#EDF6FC] focus:border-[#3B8EE0] dark:focus:border-[#F2EC38] focus:outline-none"
                >
                  <option value="Software / IoT Engineering Opportunity">
                    Software / IoT Engineering Opportunity
                  </option>
                  <option value="AI & Computer Vision Internship / Role">
                    AI &amp; Computer Vision Internship / Role
                  </option>
                  <option value="Project Collaboration">Project Collaboration</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium text-[#091933] dark:text-[#EDF6FC] mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                    if (submitted) setSubmitted(false);
                  }}
                  aria-invalid={Boolean(errors.message)}
                  placeholder="Share role details, interview schedule, or collaboration notes..."
                  className="w-full rounded-md border border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/60 dark:bg-[#081426] px-3.5 py-2.5 text-sm text-[#091933] dark:text-[#EDF6FC] placeholder:text-[#3A5173]/60 dark:placeholder:text-[#9BB8D9]/55 focus:border-[#3B8EE0] dark:focus:border-[#F2EC38] focus:outline-none resize-y"
                />
                {errors.message && (
                  <p role="alert" className="mt-1.5 text-xs text-[#091933] dark:text-[#F2EC38] font-medium">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <span className="font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                  {submitted
                    ? 'Note recorded. Feel free to reach out by email or phone directly.'
                    : 'All fields validated before submission.'}
                </span>

                <Magnetic strength={0.22} maxOffset={6}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md border border-[#091933] dark:border-[#F2EC38] bg-[#EFEA2B] dark:bg-[#F2EC38] px-5 py-2.5 text-xs font-semibold text-[#091933] hover:bg-[#091933] hover:text-[#EFEA2B] dark:hover:bg-[#66B3F5] dark:hover:border-[#66B3F5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Send Message</span>
                  </button>
                </Magnetic>
              </div>
            </form>
          </SpotlightCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
