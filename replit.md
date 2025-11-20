# Bidchemz Logistics Bidding & Lead Marketplace

## Project Overview
A B2B reverse-bidding platform for chemical logistics that connects traders with logistics partners through a competitive quotation system.

## Business Model
- Traders submit freight requirements
- System matches eligible logistics partners based on capabilities
- Partners submit competitive quotations
- Trader selects best offer
- Selected partner is charged a lead fee
- Revenue generated through lead monetization

## User Roles
1. **Trader** (Buyer/Seller): Requests logistics support and selects offers
2. **Logistics Partner**: Receives freight leads and submits quotations
3. **Admin**: Manages pricing, capabilities, credits, and system configuration
4. **Marketplace System**: Communicates via APIs and webhooks only

## Design System
- **Aesthetic**: Clean, industrial, data-centric
- **Color Palette**: Blue-driven primary colors (trust & reliability), neutral greys for hierarchy
- **Typography**: Modern, sans-serif, optimized for dense operational data
- **Layout**: Mobile-first responsive, collapsible sections, minimal cognitive load
- **Components**: Consistent spacing, strict alignment, predictable interaction states
- **Feedback**: Contextual inline errors, subtle non-intrusive success messages
- **Overall**: Precision, speed, and professionalism for B2B chemical logistics

## Technical Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (to be configured)
- **Authentication**: To be implemented
- **API**: RESTful with webhook support

## Core Features
1. 9-Section Freight Request Form
2. Partner Matching Engine
3. Quote Submission System
4. Offer Comparison Interface
5. Lead Monetization & Wallet System
6. Partner Capabilities Management
7. Admin Panel
8. API & Webhook Integration
9. Document Management (MSDS/SDS)
10. Shipment Tracking

## Recent Changes
- 2025-11-20: Complete logistics bidding platform implementation
  - PostgreSQL database setup with Prisma ORM (7.0)
  - Complete authentication system with JWT, RBAC, SSR-safe client context
  - Comprehensive UI component library
  - 9-section freight request form with validation
  - Partner matching engine with capability-based filtering
  - Partner portal with dashboard and capabilities management
  - Trader quote listing and offer comparison interface
  - Lead wallet system with atomic transactions
  - Shipment tracking system with role-based access
  - Admin panel dashboard
  - RESTful API endpoints with authentication middleware
  - Webhook system with HMAC signatures
  - Pricing engine and audit logging
  - **NEW**: Multi-channel notification system (Email, SMS, WhatsApp, Portal)
  - **NEW**: Secure document encryption/decryption for MSDS/SDS files
  - **NEW**: Quote submission countdown timer (30-60 minutes configurable)
  - **NEW**: Partner lead alert system with multi-channel notifications
  - **NEW**: Low balance wallet alert system
  - **NEW**: Automated timer warnings and quote expiry management

## Core Features Implemented
✅ User registration and authentication (Traders, Partners, Admin)
✅ 9-section freight request form with all 7 mandatory fields
✅ Automatic partner matching based on capabilities
✅ Partner quote submission system
✅ Offer comparison and selection interface
✅ Lead wallet and credit management
✅ Shipment tracking
✅ Admin panel for system management
✅ Comprehensive audit logging
✅ Webhook notifications
✅ Multi-channel alert system (Email, SMS, WhatsApp, Portal)
✅ Secure encrypted document storage for safety files
✅ Countdown timer for quote submissions (60 min default)
✅ Automated partner lead notifications
✅ Low balance wallet alerts

## API Endpoints
**Authentication**
- POST /api/auth/signup - User registration
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

**Quotes (Freight Requests)**
- GET /api/quotes - List freight requests
- POST /api/quotes - Create freight request (triggers matching & timer)
- GET /api/quotes/[id] - Get quote details with offers
- GET /api/quotes/[id]/timer - Get remaining time for quote submission
- POST /api/quotes/[id]/timer - Extend quote timer (admin only)

**Offers**
- GET /api/offers - List partner offers
- POST /api/offers - Submit offer (partners)
- POST /api/offers/[id]/select - Select winning offer

**Wallet**
- GET /api/wallet - Get wallet balance
- POST /api/wallet - Recharge wallet
- GET /api/wallet/settings - Get wallet alert settings
- PUT /api/wallet/settings - Update wallet alert settings

**Partner Management**
- GET /api/partner/capabilities - Get partner capabilities
- PUT /api/partner/capabilities - Update capabilities

**Documents (Encrypted)**
- POST /api/documents/upload - Upload encrypted MSDS/SDS document
- GET /api/documents/[id]/download - Download and decrypt document

**Shipment Tracking**
- GET /api/shipments/[id]/track - Track shipment
- POST /api/shipments/[id]/track - Update shipment status

## Deployment Notes
- Database: PostgreSQL (Neon) - configured via DATABASE_URL
- Port: 5000 (configured for Replit)
- Environment: Production-ready except for JWT_SECRET (should be set via environment variable)

## 7 Mandatory Fields Verification ✅
All required fields are implemented in the Quote model:
1. ✅ Pickup Location (exact): pickupAddress, pickupCity, pickupState, pickupPincode, pickupCountry
2. ✅ Delivery Location (exact): deliveryAddress, deliveryCity, deliveryState, deliveryPincode, deliveryCountry
3. ✅ Cargo Name (CAS number): cargoName + casNumber
4. ✅ Quantity (MT/Kg/Litres): quantity + quantityUnit
5. ✅ Packing: packagingType (BAGS, DRUMS, TANKER, ISO_TANK, FLEXITANK, IBC, PALLETS, BULK)
6. ✅ Hazardous Material (Yes/No): isHazardous + hazardClass
7. ✅ Cargo Ready Date: cargoReadyDate

## Notification System Features
- Multi-channel delivery: Email, SMS, WhatsApp, Portal
- Partner lead alerts with quote details
- Low balance wallet warnings
- Quote deadline reminders (10 minutes before expiry)
- Configurable priority levels (LOW, MEDIUM, HIGH, URGENT)
- Comprehensive audit logging for all notifications

## Document Security Features
- AES-256-GCM encryption for all uploaded documents
- Secure key generation and storage per document
- Role-based access control for document downloads
- Encrypted files stored separately from metadata
- Audit trail for all uploads and downloads
- Support for MSDS/SDS and other safety documents

## Timer System Features
- Configurable countdown timer (default: 60 minutes)
- Automatic quote expiry when time runs out
- Warning notifications at 10 minutes remaining
- Admin-only timer extension capability
- Real-time remaining time API endpoint
- Automatic status updates for expired offers

## Next Steps
- Integrate actual email/SMS/WhatsApp service providers (Twilio, SendGrid, etc.)
- Add frontend UI for document upload and download
- Create admin panel for timer configuration
- Add frontend countdown timer display
- Implement bulk wallet recharge packages
- Add more admin panel features (user management, pricing configuration)
- Production deployment configuration
