import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | AI Brief 24',
  description: 'Privacy Policy for AI Brief 24.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-8 text-white/80">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Privacy Policy</h1>
          <p className="text-sm font-medium text-white/50">Last Updated: March 2026</p>
        </div>

        <div className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              We collect only the essential information needed to provide you with a personalized AI news experience. This includes a secure push notification token for alerts, and authentication-related account data if you choose to sign up.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Information</h2>
            <p>
              Your information is strictly used to operate, maintain, and improve the AIBrief24 platform. We use it to deliver curated content, synchronize your preferences across devices, and send relevant updates. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Account and Profile Data</h2>
            <p>
              If you create an account, we securely store your email address and basic profile data such as your display name. This information is necessary for authentication and to keep your preferences linked to your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Bookmarks and Preferences</h2>
            <p>
              To provide a seamless cross-device experience, articles you bookmark and any reading preferences you set are securely stored on our servers. This ensures you never lose track of important AI research or news.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Push Notifications</h2>
            <p>
              If you opt in to alerts, we store a secure push notification token associated with your device. This allows us to send breaking AI news directly to you. You may disable this at any time in the app settings or your device OS settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Third-Party Services</h2>
            <p>
              AIBrief24 uses Supabase, Render, and Expo services to operate authentication, database storage, backend services, and notifications. These services are used only to provide and improve the app experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. External Links and Content</h2>
            <p>
              Our app aggregates news and research from across the web. When you tap an article, it may open a third-party website or source. We are not responsible for the privacy practices, tracking, or content of those external sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Data Retention and Deletion</h2>
            <p>
              We retain your data only for as long as your account is active or as needed to provide you the service. You may request deletion of your account and all associated data at any time by contacting support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Contact Information</h2>
            <p>
              For support or privacy-related questions, contact us at:{' '}
              <a href="mailto:aibrief2526@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors underline">
                aibrief2526@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
