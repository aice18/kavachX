-- This script represents the setup on the BANK'S LEGACY CORE DATABASE.
-- Our system does not own this database; we merely attach to it.

CREATE TABLE IF NOT EXISTS core_transactions (
    txn_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_from VARCHAR(50) NOT NULL,
    account_to VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'COMPLETED',
    metadata JSONB,
    txn_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. Create a function that broadcasts JSON payloads when a transaction occurs
CREATE OR REPLACE FUNCTION notify_core_transaction()
RETURNS TRIGGER AS $$
DECLARE
  payload JSON;
BEGIN
  -- Construct a JSON payload from the newly inserted row
  payload = json_build_object(
    'txn_id', NEW.txn_id,
    'account_from', NEW.account_from,
    'account_to', NEW.account_to,
    'amount', NEW.amount,
    'currency', NEW.currency,
    'metadata', NEW.metadata,
    'timestamp', NEW.txn_timestamp
  );
  
  -- Broadcast the payload on the 'core_bank_cdc_stream' channel
  PERFORM pg_notify('core_bank_cdc_stream', payload::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach the trigger to the bank's core transaction table
DROP TRIGGER IF EXISTS trg_notify_core_transaction ON core_transactions;
CREATE TRIGGER trg_notify_core_transaction
AFTER INSERT ON core_transactions
FOR EACH ROW
EXECUTE FUNCTION notify_core_transaction();
