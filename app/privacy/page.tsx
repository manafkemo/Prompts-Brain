import { LegalLayout } from '@/components/ui/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
        <p>
          At ZanZora, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our AI prompt management platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
        <p className="mb-4">
          We collect information that you provide directly to us:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account Data:</strong> Your email address and authentication details provided via our secure login system.</li>
          <li><strong>Prompt Data:</strong> The prompts, text, and images you upload specifically to be stored in your private library.</li>
          <li><strong>Usage Data:</strong> Basic logs of how you interact with the application to help us improve performance.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How Your Data is Used</h2>
        <p className="mb-4">
          Your data is used exclusively to provide you with the ZanZora experience:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To synchronize your library across your devices.</li>
          <li>To process prompt improvements via the Google Gemini API.</li>
          <li>To perform OCR text extraction on your behalf.</li>
        </ul>
        <p className="mt-4 font-bold text-violet-400">
          We do not sell your personal data or your prompt library to third parties.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
        <p>
          ZanZora uses Supabase for database management and authentication, and Google's Gemini API for AI-powered features. These services have their own privacy policies governing data sent to them for processing.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data. Your prompts are stored in a private database accessible only to you through your authenticated account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p>
          If you have questions about this policy, please reach out to us via our official support channels.
        </p>
      </section>
    </LegalLayout>
  );
}
