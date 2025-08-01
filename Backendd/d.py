import psycopg2

try:
    conn = psycopg2.connect("postgresql://neondb_owner:npg_cMa4x5bwBVtr@ep-rough-bread-a1yb9bt8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
    print("✅ Connected to DB")
except Exception as e:
    print("❌ Connection failed:", e)
