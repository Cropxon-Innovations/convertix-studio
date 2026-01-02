import { MainLayout } from "@/components/layout/MainLayout";

const CookiePolicyPage = () => {
  return (
    <MainLayout>
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. 
              They help websites remember your preferences and improve your experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use cookies for:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and session management.</li>
              <li><strong>Preference Cookies:</strong> Remember your settings like theme preference (dark/light mode).</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website to improve our services.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-2">Session Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Temporary cookies that expire when you close your browser. Used for authentication.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-2">Persistent Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Remain on your device for a set period. Used to remember your preferences.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-2">Third-Party Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Set by third-party services we use, such as Google Analytics.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Most web browsers allow you to control cookies through their settings. 
              You can set your browser to refuse cookies or delete cookies that have already been set. 
              Note that disabling cookies may affect the functionality of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us at:
            </p>
            <p className="text-primary mt-2">privacy@cropxon.com</p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default CookiePolicyPage;
