
import { Mail, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForms from "@/components/ContactForms";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="text-center h-full">
              <CardHeader>
                <Mail className="h-10 w-10 mx-auto text-primary mb-4" />
                <CardTitle>Email Us</CardTitle>
                <CardDescription>
                  For generic inquiries and support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:admin@axevora.com"
                  className="text-primary hover:text-primary/80 text-lg font-bold"
                >
                  admin@axevora.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center h-full">
              <CardHeader>
                <Globe className="h-10 w-10 mx-auto text-primary mb-4" />
                <CardTitle>Mailing Address</CardTitle>
                <CardDescription>
                  Our registered business office
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Axevora Digital Solutions<br />
                  123 Tech Park, Cyber City<br />
                  Delhi, India 110001
                </p>
              </CardContent>
            </Card>
          </div>

          <ContactForms />

          <div className="bg-card rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-2">Are your tools really free?</h3>
                <p className="text-muted-foreground">
                  Yes! All our tools are completely free to use with no hidden fees or subscriptions.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Do I need to create an account?</h3>
                <p className="text-muted-foreground">
                  No registration is required. You can use all our tools immediately without signing up.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Is my data safe?</h3>
                <p className="text-muted-foreground">
                  We prioritize your privacy. Most tools process data locally in your browser, and we never store your files.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
