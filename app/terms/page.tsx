export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: April 2026</p>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">1. Acceptance of terms</h2>
          <p>By accessing or using FlatmateFind you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the service.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">2. Who can use FlatmateFind</h2>
          <p>You must be at least 18 years old to create an account or post a listing. By using the service you confirm you meet this requirement.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">3. Listings and content</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All listing information must be accurate and not misleading.</li>
            <li>You must have the legal right to advertise a property (owner, authorised agent, or permitted subletter).</li>
            <li>Listings for illegal accommodation or discriminatory preference (beyond lawful gender/lifestyle compatibility) are prohibited.</li>
            <li>We reserve the right to remove any listing at our discretion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">4. User conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Post false, misleading, or fraudulent listings.</li>
            <li>Harass, threaten, or abuse other users.</li>
            <li>Use the platform to collect personal data from other users without their consent.</li>
            <li>Attempt to circumvent our security measures or access other users&apos; accounts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">5. No agency relationship</h2>
          <p>FlatmateFind is a listing platform only. We are not a party to any rental agreement between renters and hosts. All transactions, agreements, and disputes are solely between the users concerned.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">6. Limitation of liability</h2>
          <p>To the maximum extent permitted by law, FlatmateFind is not liable for any loss or damage arising from your use of the platform, including but not limited to rental fraud, property damage, or personal injury.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">7. Governing law</h2>
          <p>These terms are governed by the laws of New South Wales, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of New South Wales.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">8. Changes to terms</h2>
          <p>We may update these terms from time to time. Continued use of FlatmateFind after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">9. Contact</h2>
          <p>Legal enquiries: <a href="mailto:legal@flatmatefind.com" className="text-teal-600 hover:underline">legal@flatmatefind.com</a></p>
        </section>
      </div>
    </div>
  );
}
