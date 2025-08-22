'use client';

import React from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({
  isOpen,
  onClose
}: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6 text-sm text-gray-600 mb-8">
              <p className="mb-4 text-gray-500">Last updated: December 2024</p>
              
              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
                <div className="space-y-2">
                  <p><strong>Personal Information:</strong> Name, email address, phone number, and property details when you create an account or list a property.</p>
                  <p><strong>Usage Data:</strong> Information about how you use our platform, including pages visited, time spent, and interactions.</p>
                  <p><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</p>
                  <p><strong>Location Data:</strong> Property addresses and general location information for service delivery.</p>
                </div>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide and maintain our real estate platform services</li>
                  <li>Process property listings and buyer inquiries</li>
                  <li>Facilitate communication between buyers, sellers, and agents</li>
                  <li>Send important updates about your account and transactions</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Comply with legal obligations and prevent fraud</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Information Sharing</h3>
                <div className="space-y-2">
                  <p><strong>With Agents:</strong> We share relevant property and contact information with qualified real estate agents to facilitate transactions.</p>
                  <p><strong>With Service Providers:</strong> Third-party services that help us operate our platform, such as payment processors and email services.</p>
                  <p><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety.</p>
                  <p><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales.</p>
                </div>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Data Security</h3>
                <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Your Rights</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Cookies and Tracking</h3>
                <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Third-Party Links</h3>
                <p>Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any information.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Children's Privacy</h3>
                <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">9. International Transfers</h3>
                <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to This Policy</h3>
                <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the \"Last updated\" date.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">11. Contact Us</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="mb-2">If you have any questions about this Privacy Policy, please contact us:</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Email:</strong> privacy@onlyif.com</p>
                    <p><strong>Phone:</strong> 1-800-ONLYIF</p>
                    <p><strong>Address:</strong> 123 Real Estate Ave, Austin, TX 78701</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}