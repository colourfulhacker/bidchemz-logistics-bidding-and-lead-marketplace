# 🔐 BidChemz Logistics - Test Account Credentials

## Quick Start Testing Guide

### Step 1: Setup Database & Seed Test Accounts

```bash
# Run database migrations
npx prisma migrate dev

# Seed test accounts
npx ts-node scripts/seed-test-accounts.ts
```

### Step 2: Set Required Environment Variables

Create a `.env` file with:

```env
# Required for authentication
JWT_SECRET=your-secret-key-here-minimum-32-characters

# Database (should already be configured)
DATABASE_URL=your-database-connection-string

# Optional: Email notifications
SENDGRID_API_KEY=your-sendgrid-key

# Optional: SMS/WhatsApp notifications  
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
TWILIO_WHATSAPP_NUMBER=your-whatsapp-number
```

### Step 3: Start the Application

```bash
npm run dev
```

Visit: `http://localhost:5000`

---

## 📧 Test Account Credentials

### 👤 **TRADER ACCOUNTS**
Test the buyer/seller experience - create freight requests and select offers

#### Trader 1 - ABC Chemicals Ltd
```
Email:    trader1@test.com
Password: Test@123
Company:  ABC Chemicals Ltd
GSTIN:    27AABCT1234A1Z5
```
**Test Data:** 3 quotes (OFFERS_AVAILABLE, MATCHING, EXPIRED)

#### Trader 2 - Global Chemicals Corp
```
Email:    trader2@test.com  
Password: Test@123
Company:  Global Chemicals Corp
GSTIN:    29AAGCC9876B1Z5
```
**Test Data:** 2 quotes (SELECTED with shipment, OFFERS_AVAILABLE)

**What you can test:**
- ✅ Create new freight requests (9-section form)
- ✅ View submitted quotes and their status
- ✅ Review offers from logistics partners
- ✅ Compare and select winning offers
- ✅ Track shipments
- ✅ Upload MSDS/SDS documents

---

### 🚚 **LOGISTICS PARTNER ACCOUNTS**
Test the logistics provider experience - receive leads and submit competitive offers

#### Partner 1 - Express Logistics India (PREMIUM)
```
Email:    partner1@test.com
Password: Test@123
Company:  Express Logistics India
Wallet:   ₹15,000
Tier:     PREMIUM
```
**Capabilities:** Pan-India coverage | Class 3, 8, Non-Hazardous | 50 vehicles | Temperature control
**Test Data:** 2 offers submitted, 1 accepted (active shipment)

#### Partner 2 - SafeTrans Logistics (STANDARD)
```
Email:    partner2@test.com
Password: Test@123
Company:  SafeTrans Logistics
Wallet:   ₹8,000
Tier:     STANDARD
```
**Capabilities:** West India | Class 3, 6, 8 | 25 vehicles | PESO certified
**Test Data:** 2 offers submitted, 1 rejected

#### Partner 3 - ChemMove Solutions (STANDARD)
```
Email:    partner3@test.com
Password: Test@123
Company:  ChemMove Solutions
Wallet:   ₹5,000
Tier:     STANDARD
```
**Capabilities:** North India | Class 8, Non-Hazardous | 15 vehicles | Warehouse available
**Test Data:** 1 offer submitted

#### Partner 4 - National Transport Co (FREE)
```
Email:    partner4@test.com
Password: Test@123
Company:  National Transport Co
Wallet:   ₹500 ⚠️ LOW BALANCE
Tier:     FREE
```
**Capabilities:** South India | Non-Hazardous only | 10 vehicles | Limited coverage
**Test Data:** 1 offer submitted

**What you can test:**
- ✅ View incoming freight leads
- ✅ Submit competitive price quotations
- ✅ Manage partner capabilities (services, coverage, certifications)
- ✅ Check wallet balance and transaction history
- ✅ Request wallet recharge (manual approval flow)
- ✅ Track won leads and shipments

---

### 👨‍💼 **ADMIN ACCOUNT**
Test the platform management and administrative functions

```
Email:    admin@bidchemz.com
Password: Test@123
Company:  BidChemz Platform
```

**What you can test:**
- ✅ View comprehensive dashboard with analytics and charts
- ✅ **Approve/reject payment requests** (main feature you requested)
- ✅ Manage users (activate, deactivate, verify accounts)
- ✅ View all quotes and offers system-wide
- ✅ Monitor system health and statistics
- ✅ Access audit logs
- ✅ Review webhook delivery logs

---

## 🧪 Test Scenarios

### **Scenario 1: End-to-End Freight Request Flow**

1. **Login as Trader** (`trader@test.com`)
2. Click "New Quote" or go to `/quotes/new`
3. Fill all 9 sections of the freight form:
   - Shipment Info (cargo, quantity, hazardous details)
   - Pickup & Delivery locations
   - Handling requirements
   - Vehicle preferences
   - Insurance needs
4. Submit the request
5. System matches eligible partners automatically

6. **Switch to Partner** (`partner@test.com`)
7. View the new lead in "Active Leads"
8. Click "Submit Offer"
9. Enter competitive price, transit time, and services
10. Submit the offer

11. **Switch back to Trader**
12. View offers on quote detail page
13. Compare offers (price, transit time, services)
14. Select the best offer
15. System automatically deducts lead fee from partner's wallet

### **Scenario 2: Manual Payment Approval Workflow** ⭐ (Your Main Feature)

1. **Login as Partner** (`partner@test.com`)
2. Go to wallet page
3. Click "Request Recharge"
4. Enter amount (e.g., ₹10,000)
5. Enter payment proof:
   - Transaction ID
   - Reference Number
   - Upload payment screenshot (optional)
6. Submit payment request
7. Note the request status: "Pending Admin Approval"

8. **Switch to Admin** (`admin@bidchemz.com`)
9. Go to "Payments" section
10. See pending payment request from partner
11. Review details:
    - Amount requested
    - Payment proof
    - Transaction details
12. **Approve** the request:
    - Add review notes if needed
    - Click "Approve"
    - System automatically credits partner wallet
    - Transaction logged in audit trail

13. **Switch back to Partner**
14. Refresh wallet page
15. See updated balance (₹5,000 → ₹15,000)
16. View transaction history showing the credit

**Test Rejection Flow:**
- As admin, reject a payment request
- Partner receives notification
- Wallet balance remains unchanged
- Partner can submit new request

### **Scenario 3: Offer Comparison & Selection**

1. **Login as Trader**
2. Open a quote with multiple offers
3. Use offer comparison features:
   - Sort by price (lowest to highest)
   - Sort by transit time
   - Filter by value-added services
   - View partner ratings
4. Select best offer based on criteria
5. Confirm selection
6. Partner receives notification

---

## 🎨 UI/UX Pages to Review

### **Public Pages**
- [ ] Home/Landing page: `http://localhost:5000/`
- [ ] Login: `http://localhost:5000/login`
- [ ] Signup: `http://localhost:5000/signup`

### **Trader Pages**
- [ ] Dashboard: `http://localhost:5000/trader/dashboard`
- [ ] New Quote Form: `http://localhost:5000/quotes/new`
- [ ] Quote List: `http://localhost:5000/quotes`
- [ ] Quote Detail: `http://localhost:5000/quotes/[id]`
- [ ] Offer Comparison: `http://localhost:5000/quotes/[id]/offers`

### **Partner Pages**
- [ ] Dashboard: `http://localhost:5000/partner/dashboard`
- [ ] Active Leads: `http://localhost:5000/partner/leads`
- [ ] Wallet: `http://localhost:5000/partner/wallet`
- [ ] Recharge Request: `http://localhost:5000/partner/recharge`
- [ ] Capabilities: `http://localhost:5000/partner/capabilities`

### **Admin Pages**
- [ ] Dashboard (Basic): `http://localhost:5000/admin/dashboard`
- [ ] Enhanced Dashboard: `http://localhost:5000/admin/dashboard-enhanced`
- [ ] Payment Requests: `http://localhost:5000/admin/payments`
- [ ] User Management: `http://localhost:5000/admin/users`
- [ ] System Settings: `http://localhost:5000/admin/system`

---

## ⚠️ Known Limitations (To Be Fixed)

### **Critical UX Issues:**
1. Home page lacks engaging content and clear CTAs
2. Countdown timer not visible on quote detail pages
3. Offer comparison missing sort/filter controls
4. No progress indicator on long freight form
5. Mobile responsiveness needs improvement on some pages
6. Empty states need better guidance messages

### **Missing Features:**
1. Forgot Password flow not implemented
2. Partner onboarding wizard (currently manual form)
3. Admin pricing configuration UI
4. System health dashboard for admins
5. Lead filters and search on partner portal
6. Export/reporting functionality

---

## 📝 Feedback Checklist

While testing, please note:

**Functionality:**
- [ ] Does feature work as expected?
- [ ] Any errors or crashes?
- [ ] Data saves correctly?
- [ ] Proper validation messages?

**UX/Design:**
- [ ] Is navigation clear and intuitive?
- [ ] Are forms easy to understand and fill?
- [ ] Do loading states show properly?
- [ ] Are error messages helpful?
- [ ] Is mobile experience acceptable?

**Performance:**
- [ ] Pages load quickly?
- [ ] No lag when submitting forms?
- [ ] Real-time updates working?

---

## 🆘 Troubleshooting

**"Login not working"**
- Ensure test accounts are seeded: `npx ts-node scripts/seed-test-accounts.ts`
- Check JWT_SECRET is set in `.env`
- Check browser console for errors

**"Wallet balance not updating"**
- Verify admin approved the payment request
- Refresh the page
- Check transaction history for credit entry

**"No quotes/leads showing"**
- Create a test quote as trader first
- Ensure partner capabilities match quote requirements
- Check quote hasn't expired

**"Charts not loading on admin dashboard"**
- Visit `/admin/dashboard-enhanced` for charts
- Default dashboard is basic version
- Ensure API endpoint `/api/admin/stats` is working

---

## 📞 Need Help?

If you encounter issues or need clarifications:
1. Check browser console for error messages
2. Check server logs in terminal
3. Provide specific error details for faster resolution

---

**Last Updated:** November 20, 2025
**Platform Version:** 1.0 MVP
**Status:** Ready for Testing & UX Feedback
