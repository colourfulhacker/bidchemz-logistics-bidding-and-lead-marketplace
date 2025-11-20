# Bidchemz Logistics Bidding & Lead Marketplace

## Overview
Bidchemz is a B2B reverse-bidding platform for chemical logistics, connecting traders with logistics partners. It streamlines the process of obtaining competitive freight quotations for chemical transport. The platform aims to become a leading marketplace for chemical logistics, offering efficiency, transparency, and cost savings for both traders and logistics providers. Revenue is generated through lead monetization, where selected logistics partners are charged a fee for successful bids.

## User Preferences
I prefer iterative development with regular updates. Please ask before making major architectural changes or introducing new dependencies. I value clear, concise explanations and well-documented code.

## System Architecture
The platform is built with a clean, industrial, and data-centric aesthetic, utilizing a blue-driven color palette and modern sans-serif typography for a professional B2B experience. The UI/UX is mobile-first, responsive, and designed for minimal cognitive load with consistent components and contextual feedback.

**Technical Stack:**
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (with Neon configuration and Prisma ORM)
- **Authentication**: JWT-based with Role-Based Access Control (RBAC)
- **API**: RESTful with webhook support
- **Real-time**: WebSocket server for live updates

**Core Features & Implementations:**
- **User Roles**: Trader, Logistics Partner, Admin.
- **Freight Request System**: A 9-section form for traders to submit detailed freight requirements, triggering a partner matching engine.
- **Partner Matching & Bidding**: Logistics partners are matched based on capabilities, can view leads, and submit competitive offers.
- **Offer Management**: Traders can compare and select offers.
- **Lead Monetization & Wallet**: A prepaid credit system for partners, including manual payment approval.
- **Capabilities Management**: Partners manage their services, vehicle types, and hazard class handling.
- **Admin Panel**: Comprehensive management of users, pricing, payments, and system configuration.
- **Document Management**: Secure upload and download of documents (e.g., MSDS/SDS) with AES-256-GCM encryption and role-based access.
- **Shipment Tracking**: Status updates and tracking pages.
- **Notification System**: Multi-channel (Email, SMS, WhatsApp, Portal) alerts for leads, low balance, and quote deadlines.
- **Countdown Timers**: Configurable timers for quote submissions with automated expiry and warnings.
- **Security & Compliance**: GDPR/DPDP features (consent, data export/deletion), password strength validation, security headers, rate limiting, and audit logging.
- **Performance**: Pagination, caching, and optimized database queries.

## External Dependencies
- **PostgreSQL**: Primary database, configured with Neon.
- **SendGrid**: (Planned) For email notifications.
- **Twilio**: (Planned) For SMS/WhatsApp notifications.
- **Stripe**: (Configured, awaiting keys) For payment gateway integration; currently, manual payment approval is implemented.
- **Chart.js**: Used in the Admin Panel for analytics visualization.
- **Prisma ORM**: Used for database interactions.

## CRITICAL SECURITY IMPLEMENTATIONS (November 2025)

### Lead Fee Deduction System - Production Ready ✅
**Status**: Architect-verified, no critical bugs

**Implementation Details**:
1. **Atomic Wallet Deductions**: Uses Prisma `updateMany` with conditional balance check (`balance >= leadCost`) to prevent race conditions
2. **Pricing Transparency**: Database-driven pricing engine calculates costs on both frontend (preview) and backend (actual charge) using identical logic
3. **No Fallback Pricing**: UI blocks offer submission if pricing API fails - prevents mismatch between displayed and charged amounts
4. **Transaction Safety**: All operations (offer creation, wallet debit, transaction logging, audit logging) wrapped in single Prisma transaction
5. **Error Handling**: Clear user messages for insufficient balance, concurrent transaction failures, and pricing errors

**Security Guarantees**:
- ❌ **NO auto-credit vulnerability**: Direct wallet POST endpoint disabled
- ✅ **Manual payment approval**: All recharges require admin approval via payment request workflow
- ✅ **Atomic operations**: Wallet cannot go negative even under concurrent offer submissions
- ✅ **Audit trail**: All wallet operations logged with user, amount, and timestamp
- ✅ **Pricing integrity**: Same pricing engine used for preview and actual charge - no mismatches possible

**Key Files**:
- `pages/api/offers/index.ts` - Offer submission with atomic wallet deduction
- `lib/pricing-engine.ts` - Configurable pricing calculation
- `lib/wallet.ts` - Wallet management utilities
- `pages/api/calculate-lead-cost.ts` - Pricing transparency API
- `pages/partner/submit-offer.tsx` - Partner UI with pricing breakdown
- `pages/api/payment-requests/[id].ts` - Admin approval workflow

**Test Accounts**:
- Admin: `admin@bidchemz.com` / `Admin@123`
- Trader: `trader@example.com` / `Trader@123`
- Partner: `partner@logistics.com` / `Partner@123` (₹10,000 wallet balance)

**Database Schema Additions**:
- `PricingConfig` - Admin-configurable pricing parameters
- `LeadWallet` - Partner prepaid balances
- `LeadTransaction` - Complete audit trail of all wallet operations
- `PaymentRequest` - Manual payment approval workflow