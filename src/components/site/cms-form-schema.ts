export type CmsFormField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type CmsFormKind = "enquiry" | "innovation" | "newsletter";

export type CmsFormData = {
  formKind?: CmsFormKind;
  heading?: string;
  body?: string;
  submitLabel?: string;
  successMessage?: string;
  enquiryType?: string;
  fields?: CmsFormField[];
};

export function defaultCmsFormFields(kind: CmsFormKind): CmsFormField[] {
  if (kind === "newsletter") return [
    { id: "email", label: "Email address", type: "email", required: true },
  ];
  if (kind === "innovation") return [
    { id: "applicantName", label: "Your full name", type: "text", required: true },
    { id: "applicantEmail", label: "Email address", type: "email", required: true },
    { id: "organisation", label: "Organisation", type: "text", required: false },
    { id: "role", label: "Your role", type: "text", required: false },
    { id: "title", label: "Innovation title", type: "text", required: true },
    { id: "description", label: "Non-confidential description", type: "textarea", required: true, placeholder: "At least 40 characters. Do not include confidential information." },
    { id: "category", label: "Innovation category", type: "select", required: true, options: ["Agriculture & food systems", "Health & biotechnology", "Energy, climate & environment", "ICT, AI & data systems", "Manufacturing & materials", "Education & learning", "Financial inclusion & commerce", "Transport & logistics", "Water & sanitation", "Other / cross-cutting"] },
    { id: "stage", label: "Development stage", type: "select", required: true, options: ["Idea / concept", "Research findings", "Prototype / proof of concept", "Pilot or field testing", "Early-stage venture — in market", "Scaling"] },
    { id: "institutionType", label: "Institution type", type: "select", required: false, options: ["University or research organisation", "TVET / technical training institution", "School (K-12)", "Startup or enterprise", "Government or public institution", "Non-governmental organisation", "Independent innovator — no affiliation", "Other"] },
    { id: "ipAwareness", label: "IP protection status", type: "select", required: false, options: ["No IP protection considered yet", "Currently considering protection", "Protection applied for", "Protection already in place", "Not sure — I need guidance"] },
    { id: "supportNeeds", label: "Support needed", type: "textarea", required: false },
    { id: "documentsNote", label: "Supporting documents (describe; do not upload confidential files)", type: "textarea", required: false },
  ];
  return [
    { id: "name", label: "Your name", type: "text", required: true },
    { id: "email", label: "Email address", type: "email", required: true },
    { id: "organisation", label: "Organisation", type: "text", required: false },
    { id: "subject", label: "Subject", type: "text", required: false },
    { id: "message", label: "Your message", type: "textarea", required: true },
  ];
}
