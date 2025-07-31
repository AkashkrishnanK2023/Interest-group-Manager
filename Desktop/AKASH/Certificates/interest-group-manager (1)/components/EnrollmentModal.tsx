"use client"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"

interface EnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  group: any
  onSuccess?: () => void
}

interface EnrollmentData {
  // Basic info
  fullName: string
  email: string
  phone: string
  location: string

  // Category-specific fields
  [key: string]: any
}

const categoryFields = {
  Technology: [
    {
      key: "experience",
      label: "Programming Experience",
      type: "select",
      options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    { key: "languages", label: "Programming Languages", type: "text", placeholder: "e.g., JavaScript, Python, Java" },
    { key: "currentRole", label: "Current Role", type: "text", placeholder: "e.g., Software Developer, Student" },
    {
      key: "interests",
      label: "Specific Interests",
      type: "textarea",
      placeholder: "What aspects of technology interest you most?",
    },
    { key: "github", label: "GitHub Profile (Optional)", type: "text", placeholder: "https://github.com/username" },
  ],
  Sports: [
    {
      key: "experience",
      label: "Athletic Experience",
      type: "select",
      options: ["Beginner", "Recreational", "Competitive", "Professional"],
    },
    { key: "sports", label: "Sports You Play", type: "text", placeholder: "e.g., Basketball, Soccer, Tennis" },
    { key: "fitnessLevel", label: "Fitness Level", type: "select", options: ["Low", "Moderate", "High", "Very High"] },
    { key: "availability", label: "Availability", type: "text", placeholder: "e.g., Weekends, Evenings" },
    { key: "goals", label: "Athletic Goals", type: "textarea", placeholder: "What do you hope to achieve?" },
  ],
  Art: [
    {
      key: "experience",
      label: "Artistic Experience",
      type: "select",
      options: ["Beginner", "Hobbyist", "Semi-Professional", "Professional"],
    },
    {
      key: "mediums",
      label: "Preferred Art Mediums",
      type: "text",
      placeholder: "e.g., Oil painting, Digital art, Photography",
    },
    { key: "style", label: "Artistic Style", type: "text", placeholder: "e.g., Abstract, Realistic, Contemporary" },
    { key: "portfolio", label: "Portfolio/Website (Optional)", type: "text", placeholder: "https://yourportfolio.com" },
    {
      key: "inspiration",
      label: "What Inspires You?",
      type: "textarea",
      placeholder: "Tell us about your artistic inspiration",
    },
  ],
  Education: [
    {
      key: "background",
      label: "Educational Background",
      type: "text",
      placeholder: "e.g., Computer Science, Literature",
    },
    { key: "interests", label: "Learning Interests", type: "text", placeholder: "e.g., History, Science, Languages" },
    {
      key: "experience",
      label: "Teaching/Tutoring Experience",
      type: "select",
      options: ["None", "Some", "Experienced", "Professional"],
    },
    { key: "goals", label: "Learning Goals", type: "textarea", placeholder: "What do you hope to learn or teach?" },
    { key: "availability", label: "Study Availability", type: "text", placeholder: "e.g., Evenings, Weekends" },
  ],
  Music: [
    {
      key: "experience",
      label: "Musical Experience",
      type: "select",
      options: ["Beginner", "Intermediate", "Advanced", "Professional"],
    },
    { key: "instruments", label: "Instruments You Play", type: "text", placeholder: "e.g., Guitar, Piano, Vocals" },
    { key: "genres", label: "Favorite Genres", type: "text", placeholder: "e.g., Rock, Jazz, Classical" },
    {
      key: "performance",
      label: "Performance Experience",
      type: "select",
      options: ["None", "Local venues", "Regular performer", "Professional"],
    },
    { key: "goals", label: "Musical Goals", type: "textarea", placeholder: "What are your musical aspirations?" },
  ],
  Business: [
    {
      key: "experience",
      label: "Business Experience",
      type: "select",
      options: ["Student", "Entry Level", "Mid Level", "Senior Level", "Executive"],
    },
    { key: "industry", label: "Industry", type: "text", placeholder: "e.g., Technology, Healthcare, Finance" },
    { key: "role", label: "Current Role", type: "text", placeholder: "e.g., Marketing Manager, Entrepreneur" },
    { key: "interests", label: "Business Interests", type: "text", placeholder: "e.g., Startups, Marketing, Finance" },
    { key: "goals", label: "Professional Goals", type: "textarea", placeholder: "What are your business objectives?" },
  ],
  Health: [
    {
      key: "experience",
      label: "Health & Fitness Experience",
      type: "select",
      options: ["Beginner", "Some experience", "Regular practitioner", "Expert/Professional"],
    },
    {
      key: "interests",
      label: "Health Interests",
      type: "text",
      placeholder: "e.g., Nutrition, Fitness, Mental Health",
    },
    { key: "goals", label: "Health Goals", type: "textarea", placeholder: "What are your health and wellness goals?" },
    {
      key: "conditions",
      label: "Any Health Considerations?",
      type: "textarea",
      placeholder: "Optional: Any health conditions we should know about?",
    },
    {
      key: "availability",
      label: "Activity Availability",
      type: "text",
      placeholder: "e.g., Morning workouts, Evening classes",
    },
  ],
  Travel: [
    {
      key: "experience",
      label: "Travel Experience",
      type: "select",
      options: ["New to travel", "Some travel", "Experienced traveler", "Travel expert"],
    },
    {
      key: "destinations",
      label: "Favorite Destinations",
      type: "text",
      placeholder: "e.g., Europe, Asia, National Parks",
    },
    {
      key: "travelStyle",
      label: "Travel Style",
      type: "select",
      options: ["Budget", "Mid-range", "Luxury", "Adventure", "Cultural"],
    },
    { key: "interests", label: "Travel Interests", type: "text", placeholder: "e.g., Photography, Food, History" },
    {
      key: "goals",
      label: "Travel Goals",
      type: "textarea",
      placeholder: "Where would you like to go and what would you like to experience?",
    },
  ],
  Food: [
    {
      key: "experience",
      label: "Culinary Experience",
      type: "select",
      options: ["Beginner cook", "Home cook", "Experienced cook", "Professional chef"],
    },
    { key: "cuisines", label: "Favorite Cuisines", type: "text", placeholder: "e.g., Italian, Asian, Mexican" },
    { key: "dietary", label: "Dietary Preferences", type: "text", placeholder: "e.g., Vegetarian, Vegan, Gluten-free" },
    { key: "interests", label: "Food Interests", type: "text", placeholder: "e.g., Baking, Wine, Street food" },
    {
      key: "goals",
      label: "Culinary Goals",
      type: "textarea",
      placeholder: "What would you like to learn or explore?",
    },
  ],
  Gaming: [
    {
      key: "experience",
      label: "Gaming Experience",
      type: "select",
      options: ["Casual gamer", "Regular gamer", "Hardcore gamer", "Professional/Streamer"],
    },
    { key: "platforms", label: "Gaming Platforms", type: "text", placeholder: "e.g., PC, PlayStation, Xbox, Mobile" },
    { key: "genres", label: "Favorite Genres", type: "text", placeholder: "e.g., RPG, FPS, Strategy, Indie" },
    {
      key: "games",
      label: "Current Favorite Games",
      type: "text",
      placeholder: "e.g., Valorant, Minecraft, League of Legends",
    },
    {
      key: "interests",
      label: "Gaming Interests",
      type: "textarea",
      placeholder: "What aspects of gaming interest you most?",
    },
  ],
}

export default function EnrollmentModal({ isOpen, onClose, group, onSuccess }: EnrollmentModalProps) {
  const { user, joinGroup, loading } = useApp()
  const [step, setStep] = useState(1) // 1: Basic Info, 2: Category-specific, 3: Confirmation
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
  })
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen || !group) return null

  const categorySpecificFields = categoryFields[group.category as keyof typeof categoryFields] || []

  const handleInputChange = (key: string, value: string) => {
    setEnrollmentData((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      const success = await joinGroup(group._id)
      if (success) {
        onClose()
        setStep(1)
        setEnrollmentData({
          fullName: user?.name || "",
          email: user?.email || "",
          phone: "",
          location: "",
        })
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      console.error("Error joining group:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const isStepValid = () => {
    if (step === 1) {
      return enrollmentData.fullName && enrollmentData.email && enrollmentData.phone && enrollmentData.location
    }
    if (step === 2) {
      return categorySpecificFields.every((field) => {
        if (field.key === "portfolio" || field.key === "github" || field.key === "conditions") {
          return true // Optional fields
        }
        return enrollmentData[field.key]
      })
    }
    return true
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
        <div className="modal-header">
          <h2>Join {group.title}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Progress Indicator */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: step >= 1 ? "#2563eb" : "#e5e7eb",
                color: step >= 1 ? "white" : "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              1
            </div>
            <div style={{ width: "40px", height: "2px", background: step >= 2 ? "#2563eb" : "#e5e7eb" }}></div>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: step >= 2 ? "#2563eb" : "#e5e7eb",
                color: step >= 2 ? "white" : "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              2
            </div>
            <div style={{ width: "40px", height: "2px", background: step >= 3 ? "#2563eb" : "#e5e7eb" }}></div>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: step >= 3 ? "#2563eb" : "#e5e7eb",
                color: step >= 3 ? "white" : "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              3
            </div>
          </div>
        </div>

        <div style={{ fontSize: "0.875rem", textAlign: "center", marginBottom: "2rem", color: "#6b7280" }}>
          {step === 1 && "Step 1: Basic Information"}
          {step === 2 && `Step 2: ${group.category} Details`}
          {step === 3 && "Step 3: Confirm Enrollment"}
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={enrollmentData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                className="form-control"
                value={enrollmentData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                value={enrollmentData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                className="form-control"
                value={enrollmentData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, State/Country"
              />
            </div>
          </div>
        )}

        {/* Step 2: Category-specific Information */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f0f9ff", borderRadius: "8px" }}>
              <h4 style={{ margin: 0, color: "#2563eb" }}>📂 {group.category} Information</h4>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem", color: "#6b7280" }}>
                Help us understand your background in {group.category.toLowerCase()} to better match you with relevant
                activities and members.
              </p>
            </div>

            {categorySpecificFields.map((field) => (
              <div key={field.key} className="form-group">
                <label>
                  {field.label} {!["portfolio", "github", "conditions"].includes(field.key) && "*"}
                </label>
                {field.type === "select" ? (
                  <select
                    className="form-control"
                    value={enrollmentData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    className="form-control"
                    rows={3}
                    value={enrollmentData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type}
                    className="form-control"
                    value={enrollmentData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div>
            <div
              style={{
                marginBottom: "2rem",
                padding: "1.5rem",
                background: "#f0fdf4",
                borderRadius: "8px",
                border: "1px solid #bbf7d0",
              }}
            >
              <h4
                style={{ margin: "0 0 1rem 0", color: "#16a34a", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                ✅ Ready to Join {group.title}!
              </h4>
              <p style={{ margin: 0, color: "#166534" }}>
                Please review your information below and confirm your enrollment.
              </p>
            </div>

            <div style={{ background: "#f9fafb", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              <h5 style={{ margin: "0 0 1rem 0", color: "#374151" }}>📋 Your Information</h5>

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}
              >
                <div>
                  <strong>Name:</strong> {enrollmentData.fullName}
                </div>
                <div>
                  <strong>Email:</strong> {enrollmentData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {enrollmentData.phone}
                </div>
                <div>
                  <strong>Location:</strong> {enrollmentData.location}
                </div>
              </div>

              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                <strong style={{ color: "#374151" }}>{group.category} Details:</strong>
                <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.5rem" }}>
                  {categorySpecificFields.map((field) => {
                    const value = enrollmentData[field.key]
                    if (!value) return null
                    return (
                      <div key={field.key} style={{ fontSize: "0.875rem" }}>
                        <strong>{field.label}:</strong> {value}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div style={{ background: "#fef3c7", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#92400e" }}>
                <strong>📝 Note:</strong> By joining this group, you agree to participate respectfully and follow the
                group guidelines. You can update your information or leave the group at any time from your dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "2rem" }}>
          <div>
            {step > 1 && (
              <button onClick={handleBack} className="btn btn-outline" disabled={submitting}>
                ← Back
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={onClose} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>

            {step < 3 ? (
              <button onClick={handleNext} className="btn btn-primary" disabled={!isStepValid()}>
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={submitting || loading}
                style={{ minWidth: "120px" }}
              >
                {submitting || loading ? "🔄 Joining..." : "🚀 Join Group"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
