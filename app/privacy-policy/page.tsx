import { Metadata } from "next";
import { Shield, Lock, Eye, Database, Mail, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about how DIU ACM collects, uses, and protects your personal information and privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          Privacy{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
            Policy
          </span>
        </h1>
        <div className="mx-auto w-20 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          How we collect, use, and protect your personal information
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Introduction */}
      <Card className="mb-8 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 flex items-center justify-center mr-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Introduction
            </h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 space-y-4">
            <p>
              At DIU ACM, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, store, and protect
              information about you when you use our website and services.
            </p>
            <p>
              By using our website, you agree to the collection and use of
              information in accordance with this policy. If you do not agree
              with our policies and practices, please do not use our services.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Information We Collect */}
      <Card className="mb-8 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 dark:from-green-400 dark:to-green-600 flex items-center justify-center mr-4">
              <Database className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Information We Collect
            </h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Personal Information
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Student ID and department information</li>
                <li>
                  Programming platform handles (Codeforces, AtCoder, VJudge)
                </li>
                <li>Profile picture and biographical information</li>
                <li>Contest participation records and performance data</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Automatically Collected Information
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>IP address and browser information</li>
                <li>Pages visited and time spent on our website</li>
                <li>Device information and operating system</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How We Use Your Information */}
      <Card className="mb-8 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600 flex items-center justify-center mr-4">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              How We Use Your Information
            </h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 space-y-4">
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and maintain our services</li>
              <li>To create and manage user accounts</li>
              <li>To track contest participation and performance</li>
              <li>To display leaderboards and rankings</li>
              <li>To communicate with you about events and updates</li>
              <li>To improve our website and user experience</li>
              <li>To ensure security and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Information Sharing */}
      <Card className="mb-8 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-600 flex items-center justify-center mr-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Information Sharing and Disclosure
            </h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 space-y-4">
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties except in the following
              circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or court orders</li>
              <li>
                To protect our rights, property, or safety, or that of our users
              </li>
              <li>
                In connection with a merger, acquisition, or sale of assets
              </li>
              <li>
                With service providers who assist us in operating our website
                (under strict confidentiality agreements)
              </li>
            </ul>
            <p>
              Contest results, rankings, and programming handles may be
              displayed publicly as part of our competitive programming
              activities.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Security */}
      <Card className="mb-8 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 dark:from-red-400 dark:to-red-600 flex items-center justify-center mr-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Data Security
            </h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 space-y-4">
            <p>
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. These measures
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic
              storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Your Rights */}
      <Card className="mb-8 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 dark:from-cyan-400 dark:to-cyan-600 flex items-center justify-center mr-4">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Your Rights and Choices
            </h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 space-y-4">
            <p>
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and review your personal information</li>
              <li>Request corrections to inaccurate information</li>
              <li>
                Request deletion of your personal information (subject to
                certain limitations)
              </li>
              <li>
                Object to or restrict certain processing of your information
              </li>
              <li>Withdraw consent where processing is based on consent</li>
              <li>Request portability of your data</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided in the &ldquo;Contact Us&rdquo; section below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-8 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-600 flex items-center justify-center mr-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Contact Us
            </h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 space-y-4">
            <p>
              If you have any questions about this Privacy Policy or wish to
              exercise your rights, please contact us:
            </p>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <p>
                <strong>DIU ACM</strong>
              </p>
              <p>Daffodil International University</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:diuacm@diu.edu.bd"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  diuacm@diu.edu.bd
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="/contact"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Contact Form
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changes to Policy */}
      <Card className="mb-8 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-400 dark:to-teal-600 flex items-center justify-center mr-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Changes to This Privacy Policy
            </h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 space-y-4">
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or applicable laws. We will notify you of
              any material changes by posting the new Privacy Policy on this
              page and updating the &ldquo;Last updated&rdquo; date.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically to
              stay informed about how we are protecting your information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
