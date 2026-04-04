export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: April 2026</p>

      <div className="prose prose-slate max-w-none space-y-8 text-sm text-slate-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">1. About this policy</h2>
          <p>FlatmateFind (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights under the Australian Privacy Act 1988 (Cth).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">2. Information we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account information</strong> — name, email address, and chosen role (renter or subletter) when you create an account.</li>
            <li><strong>Listing data</strong> — property address, rent, photos and preferences you submit when posting a listing.</li>
            <li><strong>Messages</strong> — chat messages sent between renters and hosts via our platform.</li>
            <li><strong>Usage data</strong> — pages viewed, search filters applied, and device/browser information collected automatically.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">3. How we use your information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide, operate, and improve the FlatmateFind service.</li>
            <li>To allow renters and hosts to communicate with each other.</li>
            <li>To detect and prevent fraud and abuse.</li>
            <li>To send service-related notifications (no marketing emails without your consent).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">4. How we store your data</h2>
          <p>Account and session data is stored locally in your browser (localStorage) for this demonstration version of the platform. In a production environment, data would be encrypted and stored securely on Australian-based servers.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">5. Sharing of information</h2>
          <p>We do not sell your personal information. We only share data with third parties where necessary to operate the service (e.g. hosting providers) or where required by law.</p>
        </section>

        <section id="cookies">
          <h2 className="text-lg font-bold text-slate-900 mb-3">6. Cookies</h2>
          <p>We use essential cookies to keep you signed in. We do not use advertising or tracking cookies without your consent. You can disable cookies in your browser settings, but this may affect your ability to sign in.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">7. Your rights</h2>
          <p>Under the Australian Privacy Act you have the right to access, correct, or request deletion of your personal information at any time. Contact us at the address below to exercise these rights.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">8. Contact</h2>
          <p>Privacy enquiries: <a href="mailto:privacy@flatmatefind.com" className="text-teal-600 hover:underline">privacy@flatmatefind.com</a></p>
        </section>
      </div>
    </div>
  );
}
