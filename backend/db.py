import psycopg
from psycopg.rows import dict_row

def get_connection():
    con = psycopg.connect(
        host="localhost",
        dbname="buddy_borrowers",
        user="postgres",
        password="sql@work",
        row_factory=dict_row
    )

    try:
        yield con
    finally:
        con.close()