import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

type FormState = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  rating?: number;
};

const submitPayload = async (payload: any) => {
  try {
    if (import.meta.env.DEV) {
      await new Promise((r) => setTimeout(r, 400));
      console.info("[DEV] Would send email:", payload);
      return { ok: true };
    }
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok };
  } catch (err) {
    console.error("Submit failed", err);
    return { ok: false };
  }
};

export const QueryForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    const { ok } = await submitPayload({ type: "query", ...form });
    setLoading(false);
    if (ok) {
      toast.success("Your query was sent successfully");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      toast.error("Failed to send your query. Please try again later.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a Query</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="q-name">Name *</Label>
              <Input id="q-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
            </div>
            <div>
              <Label htmlFor="q-email">Email *</Label>
              <Input id="q-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
            </div>
          </div>
          <div>
            <Label htmlFor="q-subject">Subject *</Label>
            <Input id="q-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value || "" })} placeholder="Subject" required />
          </div>
          <div>
            <Label htmlFor="q-message">Message *</Label>
            <Textarea id="q-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe your query" rows={6} required />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Query"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const FeedbackForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "", rating: 5 });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message) {
      toast.error("Please enter your feedback message");
      return;
    }
    setLoading(true);
    const { ok } = await submitPayload({ type: "feedback", ...form });
    setLoading(false);
    if (ok) {
      toast.success("Thank you! Your feedback has been sent");
      setForm({ name: "", email: "", message: "", rating: 5 });
    } else {
      toast.error("Failed to send feedback. Please try again later.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="f-name">Name</Label>
              <Input id="f-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name (optional)" />
            </div>
            <div>
              <Label htmlFor="f-email">Email</Label>
              <Input id="f-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com (optional)" />
            </div>
          </div>
          <div>
            <Label htmlFor="f-rating">Rating</Label>
            <Input id="f-rating" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} placeholder="1-5" />
          </div>
          <div>
            <Label htmlFor="f-message">Message *</Label>
            <Textarea id="f-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you think" rows={6} required />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Feedback"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const ContactForms: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <QueryForm />
      <FeedbackForm />
    </div>
  );
};

export default ContactForms;