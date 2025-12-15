import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  rating?: number;
};

// Simple helper to open mailto link since we don't have a backend
const sendViaMailto = (payload: any & { type: string }) => {
  const recipient = "admin@axevora.com";
  let subject = "";
  let body = "";

  if (payload.type === 'query') {
    subject = `[Query] ${payload.subject}`;
    body = `Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`;
  } else {
    subject = `[Feedback] New ${payload.rating} Star Review`;
    body = `Name: ${payload.name}\nEmail: ${payload.email}\nRating: ${payload.rating}/5\n\nFeedback:\n${payload.message}`;
  }

  const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
  return true;
};

export const QueryForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Please fill in required fields");
      return;
    }

    sendViaMailto({ type: "query", ...form });
    toast.success("Opening your email client...");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" /> Send a Query
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="q-name">Name *</Label>
              <Input id="q-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
            </div>
            <div>
              <Label htmlFor="q-email">Email</Label>
              <Input id="q-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your email (optional)" />
            </div>
          </div>
          <div>
            <Label htmlFor="q-subject">Subject</Label>
            <Input id="q-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value || "" })} placeholder="Subject" />
          </div>
          <div>
            <Label htmlFor="q-message">Message *</Label>
            <Textarea id="q-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe your query" rows={6} required />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              <Send className="w-4 h-4 mr-2" /> Send Query
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const FeedbackForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "", rating: 5 });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendViaMailto({ type: "feedback", ...form });
    toast.success("Opening your email client...");
    setForm({ name: "", email: "", message: "", rating: 5 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" /> Send Feedback
        </CardTitle>
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
            <Label htmlFor="f-rating">Rating (1-5)</Label>
            <Input id="f-rating" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} placeholder="5" />
          </div>
          <div>
            <Label htmlFor="f-message">Message *</Label>
            <Textarea id="f-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you think" rows={6} required />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="secondary">Give Feedback</Button>
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