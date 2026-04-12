import { LegalLayout } from '@/components/ui/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using ZanZora, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
        <p>
          ZanZora provides a tool for organizing, analyzing, and improving artificial intelligence prompts. We provide the platform, but you are responsible for the content of the prompts you create.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. All activities that occur under your account are your responsibility. You must notify us immediately of any unauthorized use of your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Content Ownership</h2>
        <p>
          You retain all ownership rights to the prompts and data you input into ZanZora. By using the service, you grant us a limited license to process this data solely for the purpose of providing the platform features to you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Prohibited Conduct</h2>
        <p className="mb-4">
          You agree not to use ZanZora to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Generate prompts for illegal, harmful, or deceptive purposes.</li>
          <li>Violate any third-party intellectual property or privacy rights.</li>
          <li>Attempt to breach or circumvent the platform's security measures.</li>
          <li>Scrape or extract data from the platform for commercial use.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
        <p>
          ZanZora is provided "as is" without warranties of any kind. We are not liable for any damages resulting from your use of the service or any AI-generated content produced through the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at our discretion if we believe you have violated these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Your continued use of the service after such changes constitutes your acceptance of the new terms.
        </p>
      </section>
    </LegalLayout>
  );
}
