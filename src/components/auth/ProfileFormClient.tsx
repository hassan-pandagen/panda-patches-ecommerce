"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface ProfileFormClientProps {
  initial: {
    full_name: string;
    phone: string;
    company_name: string;
    default_shipping_address: string;
  };
}

export default function ProfileFormClient({ initial }: ProfileFormClientProps) {
  const [fullName, setFullName] = useState(initial.full_name);
  const [phone, setPhone] = useState(initial.phone);
  const [company, setCompany] = useState(initial.company_name);
  const [address, setAddress] = useState<string>(initial.default_shipping_address);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage({ type: "error", text: "Session expired. Please sign in again." });
      setSubmitting(false);
      return;
    }
    if (!user.email) {
      // customer_profiles.email is NOT NULL. Auth users always have an email,
      // but TypeScript types it as string | undefined, so guard at the boundary.
      setMessage({ type: "error", text: "Your account is missing an email. Please sign in again." });
      setSubmitting(false);
      return;
    }

    // customer_profiles.email is NOT NULL. RLS only permits UPDATE for the
    // owning customer, so this upsert will only ever take the UPDATE branch.
    // We include email for correctness in case the row is missing.
    // updated_at is set explicitly because no DB trigger maintains it.
    const { error } = await supabase
      .from("customer_profiles")
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: fullName.trim() || null,
          phone: phone || null,
          company_name: company || null,
          default_shipping_address: address || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    setSubmitting(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: "Profile updated." });
  };

  const fieldCls =
    "w-full px-4 py-3 border border-gray-200 rounded-[10px] focus:border-panda-green focus:ring-2 focus:ring-panda-green/10 outline-none text-[14px]";
  const labelCls = "block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider";

  return (
    <div className="bg-white border border-gray-200 rounded-[20px] p-7 md:p-8">
      {message && (
        <div
          className={`p-3 mb-5 rounded-[10px] text-[13px] font-semibold ${
            message.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>

        <div>
          <h2 className="text-[15px] font-black text-panda-dark uppercase tracking-wider mb-4">Contact</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className={fieldCls}
                autoComplete="name"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={fieldCls}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className={labelCls}>Company (optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc."
                  className={fieldCls}
                  autoComplete="organization"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-[15px] font-black text-panda-dark uppercase tracking-wider mb-4">Default Shipping Address</h2>
          <div>
            <label className={labelCls}>Default shipping address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              placeholder={"123 Main St\nApt 4B\nAustin, TX 78701\nUnited States"}
              className={fieldCls}
              autoComplete="street-address"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-panda-dark text-panda-yellow font-black text-[15px] py-3.5 rounded-[12px] hover:bg-black hover:scale-[1.01] transition-all uppercase tracking-[0.1em] shadow-lg disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
