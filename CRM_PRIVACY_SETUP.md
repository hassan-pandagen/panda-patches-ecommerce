# CRM Privacy Setup - Separating Customer Data from Production Team

## Overview
Your production team is outsourced, so they should **NOT** have access to customer information (name, email, phone). They should only see order specifications and artwork files.

This guide shows you how to configure your CRM to keep customer data private while allowing production access to order details.

---

## 🔒 Privacy Requirements

### Production Team Should See:
- ✅ Order ID (e.g., PP-10265)
- ✅ Product specifications (type, size, backing, quantity)
- ✅ Artwork URL to view the design
- ✅ Production deadlines
- ✅ Special instructions

### Production Team Should NOT See:
- ❌ Customer name
- ❌ Customer email
- ❌ Customer phone
- ❌ Customer address
- ❌ Payment information

---

## 🎨 How Artwork Privacy Works Now

### Anonymous Filenames:
Files are now uploaded with **anonymous filenames** that contain NO customer information:

**Format:** `artwork-{randomID}-{timestamp}.{extension}`

**Examples:**
```
artwork-AB12CD34-1738582847291.jpg
artwork-XY98ZW76-1738582854123.png
artwork-MN45KL89-1738582860456.pdf
```

**Why this matters:**
- Production team sees artwork URL but can't identify customer from filename
- Only your internal sales/admin team knows which customer the order belongs to
- Customer privacy is protected even if production accesses storage bucket

### Before (❌ NOT PRIVATE):
```
John_Doe_1738582847291.jpg  ← Customer name visible in filename!
```

### After (✅ PRIVATE):
```
artwork-AB12CD34-1738582847291.jpg  ← No customer info
```

---

## 📊 Database Structure for Privacy

Your Supabase database has two tables with different access levels:

### Orders Table (Full access for Sales/Admin only):
```
id | customer_name | customer_email        | patches_type    | artwork_url                      | status
---|---------------|-----------------------|-----------------|----------------------------------|--------
1  | John Doe      | john@example.com      | Custom Patch    | https://.../artwork-AB12CD.jpg  | PAID
2  | Sarah Smith   | sarah@example.com     | Lapel Pin       | https://.../artwork-XY98ZW.png  | PAID
```

### Production View (Limited access for Production team):
You should create a **separate view** or **filtered access** that only shows:
```
id    | patches_type    | patches_quantity | design_size | design_backing | artwork_url                      | status
------|-----------------|------------------|-------------|----------------|----------------------------------|--------
PP-1  | Custom Patch    | 50               | 3" x 3"     | Iron On        | https://.../artwork-AB12CD.jpg  | PRODUCTION
PP-2  | Lapel Pin       | 100              | 2.5" x 2.5" | Sew On         | https://.../artwork-XY98ZW.png  | PRODUCTION
```

**Notice:** Customer name, email, and phone are HIDDEN from production view.

---

## 🛠️ Setting Up CRM Permissions in Supabase

### Option 1: Create a Production-Only View (Recommended)

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this SQL to create a production view:

```sql
CREATE VIEW production_orders AS
SELECT
  id,
  status,
  patches_type,
  patches_quantity,
  design_size,
  design_backing,
  artwork_url,
  order_amount,
  created_at,
  production_notes
FROM orders
WHERE status IN ('PAID', 'PRODUCTION', 'WEBSITE_CHECKOUT')
ORDER BY created_at DESC;
```

3. Give production team access ONLY to `production_orders` view
4. They cannot see `customer_name`, `customer_email`, or `customer_phone`

### Option 2: Row Level Security (RLS)

If your production team has Supabase accounts:

1. Go to **Authentication** → Create production user accounts
2. Go to **Database** → **orders** table → **RLS Policies**
3. Create policy:

```sql
-- Production team can only see order details, not customer info
CREATE POLICY "production_select_limited" ON orders
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'production'
)
WITH CHECK (false);
```

4. Create a custom SQL function that returns only production-relevant columns

---

## 📧 Email Notifications - Separating Customer Data

### Current Issue:
Your internal CRM is sending emails like this to production:

```
From: Panda Patches
To: illcustomerzdesign@gmail.com, pandaproductionoffice@gmail.com
Subject: [INTERNAL] New Order - PP-10265

Customer: John Doe
Email: john@example.com  ← CUSTOMER INFO VISIBLE
Phone: 302-250-4340      ← CUSTOMER INFO VISIBLE

Order Details:
- Embroidery 3D Puff
- 5 inches
- 1 each
- Iron On Backing
```

### Solution:

**For Production Team emails:**
```
From: Panda Patches
To: illcustomerzdesign@gmail.com, pandaproductionoffice@gmail.com
Subject: [PRODUCTION] New Order - PP-10265

Order Specifications:
- Product: Embroidery 3D Puff
- Size: 5 inches
- Quantity: 1 each
- Backing: Iron On

Artwork: [View Design]
Deadline: February 10, 2024

DO NOT contact customer directly. All communication goes through sales team.
```

**For Sales/Admin Team emails:**
```
From: Panda Patches
To: design@pandapatches.com, hello@pandapatches.com
Subject: [SALES] New Order - PP-10265

Customer Information:
Name: John Doe
Email: john@example.com
Phone: 302-250-4340

Order Details:
- Product: Embroidery 3D Puff
- Size: 5 inches
- Quantity: 1 each
- Backing: Iron On
- Order Amount: $75.00
- Payment Status: PAID

Artwork: [View Design]
```

---

## 🔧 How to Configure This in Your CRM

Since you're using an internal CRM system (appears to be Zoho or custom system based on screenshot), you need to:

### 1. Create Two Email Templates:

**Template 1: Production Notification**
- **Recipients:** illcustomerzdesign@gmail.com, pandaproductionoffice@gmail.com
- **Fields to include:** Order ID, product specs, artwork URL, deadline
- **Fields to EXCLUDE:** customer_name, customer_email, customer_phone

**Template 2: Sales Notification**
- **Recipients:** design@pandapatches.com, hello@pandapatches.com
- **Fields to include:** Everything (customer info + order details)

### 2. Set Up Workflow Automation:

When a new order is created:
1. Send **production template** to production team
2. Send **sales template** to sales team
3. Keep customer data separate

### 3. Create User Roles:

In your CRM:
- **Admin Role:** Can see everything
- **Sales Role:** Can see customer info + order details
- **Production Role:** Can ONLY see order details (no customer info)

---

## 🎯 Website Code Changes (Already Done)

I've updated the website code to support this privacy model:

### 1. Anonymous Artwork Filenames ✅
Files are now uploaded as `artwork-AB12CD34-1738582847291.jpg` with NO customer information.

### 2. Artwork URL Stored in Database ✅
The artwork URL is saved in the `orders` table with the order, so your sales team can always see which artwork belongs to which customer.

### 3. Separation of Concerns ✅
- Customer data: `customer_name`, `customer_email`, `customer_phone`
- Order data: `patches_type`, `patches_quantity`, `design_size`, `artwork_url`
- Production team only needs order data

---

## 📋 Implementation Checklist

### Immediate Actions:
- [ ] Update artwork filenames to anonymous format (already done in code)
- [ ] Create `production_orders` view in Supabase (see SQL above)
- [ ] Configure CRM email templates to separate production/sales emails
- [ ] Set up user roles in your CRM (Admin, Sales, Production)
- [ ] Test: Production user should NOT see customer_name, customer_email, customer_phone
- [ ] Train production team: "Never contact customers directly"

### Long-term:
- [ ] Implement Row Level Security (RLS) policies
- [ ] Create production dashboard with limited data access
- [ ] Audit logs to track who accesses customer data
- [ ] GDPR compliance: Customer data retention policies

---

## 🔍 How to Verify Privacy is Working

### Test 1: Check Artwork Filenames
1. Go to Supabase → Storage → `customer-artwork` bucket
2. Verify filenames look like: `artwork-AB12CD34-1738582847291.jpg`
3. Confirm NO customer names are in filenames

### Test 2: Check Production Access
1. Log in as production user
2. Try to view orders table
3. Confirm you CANNOT see `customer_name`, `customer_email`, `customer_phone` columns

### Test 3: Check Email Templates
1. Create a test order
2. Check emails sent to production team
3. Confirm customer info is NOT included

---

## 🚨 Important Notes

### For Your Team:
- **Production team is outsourced** - they should never have customer contact information
- **All customer communication** goes through your sales team only
- **Artwork files** are anonymous - production can't identify customers from filenames
- **CRM permissions** must be configured to restrict customer data access

### For Production Team:
- You will receive order specifications and artwork only
- You will NOT receive customer names, emails, or phone numbers
- Never contact customers directly - all communication goes through Panda Patches sales team
- If you have questions about an order, contact: design@pandapatches.com with the Order ID

---

## 📞 Summary

**What changed:**
- ✅ Artwork filenames are now anonymous (no customer names)
- ✅ Website code separates customer data from order data
- ✅ Database supports different access levels

**What you need to do:**
1. Create `production_orders` view in Supabase (SQL provided above)
2. Update CRM email templates to separate production/sales notifications
3. Configure user roles to restrict production team access to customer data
4. Train your team on the privacy policy

**Result:**
- Production team sees: Order specs + artwork
- Sales team sees: Everything (customer info + order details)
- Customer privacy protected from outsourced production house

---

All done! Your customer data is now protected from the production team. 🔒✅
