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
          <h2 className="text-lg font-bold text-slate-900 mb-3">6. Cookie Policy</h2>
          <p className="mb-3">This Cookie Policy explains what cookies are, which ones FlatmateFind uses, and how you can manage them.</p>

          <h3 className="font-semibold text-slate-800 mb-2">What are cookies?</h3>
          <p className="mb-3">Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences and improve your experience. Cookies cannot run programs or deliver viruses to your device.</p>

          <h3 className="font-semibold text-slate-800 mb-2">Cookies we use</h3>
          <ul className="list-disc pl-5 space-y-2 mb-3">
            <li><strong>Essential cookies</strong> — Required for the site to function. These keep you signed in and remember your session. You cannot opt out of these without disabling the service.</li>
            <li><strong>Preference cookies</strong> — Remember your settings such as saved filters and display preferences so you don&apos;t have to re-enter them on each visit.</li>
            <li><strong>Analytics cookies</strong> — Help us understand how visitors use the site (e.g. which pages are most visited). Data is aggregated and anonymous. We only use these with your consent.</li>
          </ul>

          <h3 className="font-semibold text-slate-800 mb-2">Third-party cookies</h3>
          <p className="mb-3">We do not serve third-party advertising cookies. If we integrate any third-party tools (e.g. analytics), those providers may set their own cookies subject to their own privacy policies.</p>

          <h3 className="font-semibold text-slate-800 mb-2">Managing cookies</h3>
          <p className="mb-3">You can control and delete cookies through your browser settings. Note that disabling essential cookies will prevent you from signing in or using account features. Most browsers allow you to:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>View cookies currently stored</li>
            <li>Block all or specific cookies</li>
            <li>Delete cookies when you close your browser</li>
          </ul>

          <h3 className="font-semibold text-slate-800 mb-2">Changes to this policy</h3>
          <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date. Continued use of FlatmateFind after changes constitutes acceptance of the revised policy.</p>
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
