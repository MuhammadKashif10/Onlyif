'use client';

import React from 'react';
import { Button } from '@/components/reusable';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-lg text-gray-600">OnlyIf Platform Terms & Conditions</p>
            <p className="text-sm text-gray-500">Last updated: June 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* General Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">General Terms</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Welcome to OnlyIf. By using our platform, you agree to be bound by these Terms of Service. 
                These terms apply to all users of the OnlyIf platform, including buyers, sellers, and agents.
              </p>
            </div>
          </section>

          {/* Seller Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller Terms & Conditions</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="prose prose-gray max-w-none text-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. SUCCESS FEE AGREEMENT</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>You agree to pay OnlyIf a success fee of 1.1% (inclusive of GST) of the final sale price</li>
                  <li>This fee is ONLY payable if OnlyIf introduces a buyer who proceeds to an unconditional purchase</li>
                  <li>No fee is payable if the property does not sell through OnlyIf's platform</li>
                  <li>The success fee will be deducted from the settlement proceeds</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">2. PLATFORM COMMITMENT</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>You agree not to bypass OnlyIf or any introduced agent in any transaction</li>
                  <li>All negotiations and communications with buyers introduced by OnlyIf must go through the platform</li>
                  <li>You will not directly contact or negotiate with buyers outside of the OnlyIf system</li>
                  <li>Any attempt to circumvent the platform may result in account termination and legal action</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">3. PROPERTY LISTING REQUIREMENTS</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>You warrant that you have the legal right to sell the property</li>
                  <li>All information provided about the property must be accurate and complete</li>
                  <li>You will promptly update any changes to property details or availability</li>
                  <li>Professional photography and property presentation standards must be maintained</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">4. MARKETING AND PROMOTION</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>OnlyIf may use property images and details for marketing purposes</li>
                  <li>You grant OnlyIf permission to advertise your property across various channels</li>
                  <li>Property information may be shared with qualified buyers and agents</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Buyer Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Buyer Terms & Conditions</h2>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="prose prose-gray max-w-none text-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. PLATFORM USAGE</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>You agree to use OnlyIf's platform in good faith for genuine property purchases</li>
                  <li>All property inquiries and communications must be conducted through the platform</li>
                  <li>You will provide accurate information about your buying requirements and financial capacity</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">2. PROPERTY ACCESS FEES</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>The $49 unlock fee for premium property details is non-refundable</li>
                  <li>This fee is charged once per property and provides access to detailed information</li>
                  <li>Fees are clearly disclosed before payment and contribute to maintaining high-quality property information</li>
                  <li>No refunds will be provided regardless of your decision to proceed with the property</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">3. COMMUNICATION POLICY</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>You agree not to contact sellers directly outside of the OnlyIf platform</li>
                  <li>All communications with sellers must go through OnlyIf's messaging system</li>
                  <li>Direct contact attempts may result in account suspension or termination</li>
                  <li>OnlyIf facilitates all negotiations and communications for your protection</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">4. AGENT INTERACTIONS</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>You agree to work exclusively with agents introduced through OnlyIf for properties found on our platform</li>
                  <li>All negotiations must be conducted through OnlyIf's system</li>
                  <li>Bypassing introduced agents is prohibited and may result in legal action</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">General Terms & Conditions</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="prose prose-gray max-w-none text-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. GENERAL TERMS</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>These terms are governed by Australian law</li>
                  <li>OnlyIf reserves the right to update these terms with reasonable notice</li>
                  <li>Account termination may occur for breach of these terms</li>
                  <li>All disputes will be resolved through binding arbitration</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">6. PAYMENT AND REFUNDS</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>All payments made through the platform are final</li>
                  <li>Property unlock fees are non-refundable under any circumstances</li>
                  <li>Additional fees may apply for premium services as clearly disclosed</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">7. DATA AND PRIVACY</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Your personal and property information will be handled according to our Privacy Policy</li>
                  <li>We may contact you regarding your listing and platform updates</li>
                  <li>You can opt out of marketing communications at any time</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">8. LIMITATION OF LIABILITY</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>OnlyIf is not liable for any indirect, incidental, or consequential damages arising from the use of our services</li>
                  <li>Our liability is limited to the amount of fees paid to OnlyIf</li>
                  <li>Users acknowledge that real estate transactions carry inherent risks</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">9. MODIFICATIONS</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>We reserve the right to modify these terms at any time</li>
                  <li>Changes will be effective immediately upon posting</li>
                  <li>Continued use of the platform constitutes acceptance of modified terms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Email:</strong> legal@onlyif.com</p>
                <p><strong>Phone:</strong> 1-800-ONLYIF</p>
                <p><strong>Address:</strong> 123 Real Estate Ave, Austin, TX 78701</p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
            <Link href="/contact" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Contact Support
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}