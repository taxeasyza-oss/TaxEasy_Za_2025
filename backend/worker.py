import os
import time
import psycopg2
from flask import Flask

app = Flask(__name__)

# Database configuration from environment variables
DB_HOST = os.getenv('PGHOST')
DB_NAME = os.getenv('PGDATABASE')
DB_USER = os.getenv('PGUSER')
DB_PASSWORD = os.getenv('PGPASSWORD')

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

def process_background_tasks():
    import signal
    shutdown = False
    
    def handle_shutdown(signum, frame):
        nonlocal shutdown
        print("Received shutdown signal")
        shutdown = True
    
    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)
    
    retry_delay = 1
    max_delay = 60
    
    while not shutdown:
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    print("Processing background tasks...")
                    # TODO: Implement actual background tasks
                    cur.execute("SELECT 1")  # Keep connection active
                    conn.commit()
                    retry_delay = 1  # Reset delay on success
                    time.sleep(60)
        except Exception as e:
            print(f"Error processing tasks: {e}")
            sleep_time = min(retry_delay, max_delay)
            print(f"Retrying in {sleep_time}s...")
            time.sleep(sleep_time)
            retry_delay *= 2  # Exponential backoff
        finally:
            if conn and not conn.closed:
                conn.close()

if __name__ == "__main__":
    process_background_tasks()