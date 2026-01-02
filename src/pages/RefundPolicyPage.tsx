import { MainLayout } from "@/components/layout/MainLayout";

const RefundPolicyPage = () => {
  return (
    <MainLayout>
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              At CropXon, we strive to provide the best file conversion experience. 
              If you're not satisfied with our service, we're here to help.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Free Tier</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our free tier allows you to try Convertix at no cost. Since no payment is involved, 
              refunds do not apply to free tier usage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Paid Subscriptions</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For paid subscriptions, the following refund policy applies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Within 7 Days:</strong> Full refund available if you're not satisfied with our premium features.</li>
              <li><strong>8-30 Days:</strong> Prorated refund based on unused time remaining in your billing period.</li>
              <li><strong>After 30 Days:</strong> No refund available, but you can cancel to prevent future charges.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How to Request a Refund</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To request a refund:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
              <li>Email us at billing@cropxon.com with your account email and reason for refund</li>
              <li>Include your order/transaction ID if available</li>
              <li>We'll process your request within 5 business days</li>
              <li>Refunds will be issued to the original payment method</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Exceptions</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Refunds may not be available in the following cases:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Account termination due to violation of Terms of Service</li>
              <li>Abuse of the refund policy (multiple refund requests)</li>
              <li>Chargebacks initiated without contacting us first</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cancellation</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can cancel your subscription at any time through your account settings. 
              Upon cancellation, you'll retain access to premium features until the end of 
              your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For billing questions or refund requests, please contact:
            </p>
            <p className="text-primary mt-2">billing@cropxon.com</p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default RefundPolicyPage;
