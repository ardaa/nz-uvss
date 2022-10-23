import sqlite3

conn = sqlite3.connect("C:\\Program Files\\HuarayTech\\MV Viewer\\Development\\Samples\\Python\\uvss_last\\Storage\\Database\\records.db")
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS records (
                                        id          INTEGER PRIMARY KEY, 
                                        plate       TEXT, 
                                        timestamp   INTEGER, 
                                        front_img   TEXT,
                                        chassis_img TEXT,
                                        plate_img   TEXT,
                                        color       TEXT,
                                        detection   INTEGER
                                        )''')
conn.commit()

c.execute('''CREATE TABLE IF NOT EXISTS status (
                                        id          INTEGER PRIMARY KEY, 
                                        plate       INTEGER,
                                        front       INTEGER,
                                        chassis     INTEGER
                                        )''')

conn.commit()

c.execute('''CREATE TABLE IF NOT EXISTS detections (
                                        id          INTEGER PRIMARY KEY, 
                                        prev_id     INTEGER,
                                        last_id     INTEGER,
                                        out_img     TEXT
                                        )''')

conn.commit()

c.execute('''INSERT INTO status (plate, front, chassis) 
                                VALUES (1,1,1)''')
conn.commit()
# (id, plate, timestamp, front_img, chassis_img, plate_img, color)
conn.close()
quit()