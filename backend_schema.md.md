# BACKEND & AUTOMATION SCHEMA (SUPABASE & n8n READY)

## 1. Database Schema (Supabase)
Agent must initialize the following PostgreSQL tables for the mock backend.

### Table: `reservations`
- `id` (uuid, primary key)
- `customer_name` (text, not null)
- `phone_number` (text, not null)
- `reservation_date` (date, not null)
- `reservation_time` (time, not null)
- `guests_count` (integer, not null)
- `lounge_preference` (text, enum: 'Breakfast', 'Beef', 'Chicken', 'Pizza', 'Pasta')
- `status` (text, default: 'pending')
- `created_at` (timestamp, default: now())

### Table: `web_orders` (For Option C - Mock Direct Order)
- `id` (uuid, primary key)
- `customer_name` (text, not null)
- `phone_number` (text, not null)
- `delivery_address` (text, not null)
- `order_items` (jsonb, not null) - Array of item IDs and quantities
- `total_price` (numeric, not null)
- `status` (text, default: 'processing')
- `created_at` (timestamp, default: now())

## 2. Automation Payload Structure (n8n Webhook Ready)
For the WhatsApp Order (Option A), the agent must construct the data payload in the exact JSON format below before encoding it into the WhatsApp URL. This ensures seamless ingestion by an external n8n webhook in future iterations.

```json
{
  "event": "new_whatsapp_order",
  "source": "makan_web_frontend",
  "order_data": {
    "items": [
      {
        "item_name": "Tenderloin (Filet Mignon)",
        "category": "Beef Lounge",
        "quantity": 1,
        "unit_price_le": 693
      },
      {
        "item_name": "V60 Coffee",
        "category": "Hot Coffee",
        "quantity": 2,
        "unit_price_le": 144
      }
    ],
    "order_total_le": 981
  },
  "timestamp": "ISO-8601-FORMAT"
}