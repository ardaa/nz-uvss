import sqlite3
import time

class Database:
    def __init__(self, db_storage):
        self.database_file = "{}\\records.db".format(db_storage)
        self.database_conn = sqlite3.connect(self.database_file)
        self.database_cursor = self.database_conn.cursor()

    def get_row_id(self):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        cursor = database_cursor.execute('SELECT max(id) FROM records')
        max_id = cursor.fetchone()[0]

        return max_id

    def insert_record(self, timestamp):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        print(timestamp, type(timestamp))
        database_cursor.execute("INSERT INTO records (timestamp) VALUES (?)", (timestamp,))
        database_conn.commit()
        out = database_cursor.lastrowid
        return out

    def get_status(self):
        database_conn = self.database_conn
        database_cursor = self.database_cursor

        lastentry = database_cursor.execute('''
                                SELECT * 
                                FROM status
                                WHERE id = 1
                                ''').fetchone()
        database_conn.commit()
        return lastentry
    
    def set_plate_status(self,status):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        database_cursor.execute('''
                                UPDATE status 
                                SET plate = (?) 
                                WHERE id = 1 
                                ''', (status,))
        database_conn.commit()
        out = database_cursor.lastrowid



    def set_front_status(self,status):
        database_conn = self.database_conn
        database_cursor = self.database_cursor

        database_cursor.execute('''
                                UPDATE status 
                                SET front = (?) 
                                WHERE id = 1 
                                ''', (status,))
        database_conn.commit()
        out = database_cursor.lastrowid


    def set_chassis_status(self,status):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        

        database_cursor.execute('''
                                UPDATE status 
                                SET chassis = (?) 
                                WHERE id = 1 
                                ''', (status,))
        database_conn.commit()
        out = database_cursor.lastrowid


    def add_plate_img(self, rowid, plateimg):
        database_conn = self.database_conn
        database_cursor = self.database_cursor


        database_cursor.execute('''
                                UPDATE records 
                                SET plate_img = (?) 
                                WHERE id = (?) 
                                ''', (plateimg, rowid,))
        database_conn.commit()
        out = database_cursor.lastrowid




    def add_front_img(self, rowid, frontimg):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        database_cursor.execute('''
                                UPDATE records 
                                SET front_img = (?) 
                                WHERE id = (?) 
                                ''', (frontimg, rowid,))
        database_conn.commit()
        out = database_cursor.lastrowid



    def add_chassis_img(self, rowid, chassisimg):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        database_cursor.execute('''
                                UPDATE records 
                                SET chassis_img = (?) 
                                WHERE id = (?) 
                                ''', (chassisimg, rowid,))
        database_conn.commit()
        out = database_cursor.lastrowid


    def add_color(self,rowid,color):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        database_cursor.execute('''
                                UPDATE records 
                                SET color = (?) 
                                WHERE id = (?) 
                                ''', (color, rowid,))
        database_conn.commit()

    def update_plate(self,rowid,plate):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        database_cursor.execute('''
                                UPDATE records 
                                SET plate = (?) 
                                WHERE id = (?) 
                                ''', (plate, rowid,))
        database_conn.commit()


    def get_last_db_entry(self):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        rowid = database_cursor.lastrowid
        lastentry = database_cursor.execute('''
                                SELECT * 
                                FROM records
                                WHERE id = (?)
                                ''', (rowid,) ).fetchone()
        database_conn.commit()
        return lastentry

    def get_all_records_plate(self, plate): 
        
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        
        records = database_cursor.execute('''
                                SELECT *
                                FROM records
                                WHERE plate = (?)
                                ''', (plate,) ).fetchall()
        database_conn.commit()
        return records

    def get_last_second_record_id_plate(self,plate):
        
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        

        #SQL calisiyor, pythonunu denemedim

        records = database_cursor.execute('''
                                SELECT MAX (id) 
                                FROM records
                                WHERE plate = (?) 
                                AND id NOT IN (SELECT MAX (id) 
                                FROM records
                                WHERE plate = (?))
                                ''', (plate, plate,) ).fetchall()

        database_conn.commit()
        return records


    def get_last_n_records(self,count):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        

        #SQL calisiyor, pythonunu denemedim

        records = database_cursor.execute('''SELECT * 
                                            FROM records 
                                            ORDER BY id DESC 
                                            LIMIT (?);
                                            ''', (count,) ).fetchall()

        database_conn.commit()
        return records

    def get_last_n_detections(self,count):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        

        #SQL calisiyor, pythonunu denemedim

        detections = database_cursor.execute('''SELECT * 
                                            FROM detections 
                                            ORDER BY id DESC 
                                            LIMIT (?);
        
                                            ''', (count,) ).fetchall()

        database_conn.commit()
        return detections







    def insert_detection(self, prev_id, last_id, outpath):

        database_conn = self.database_conn
        database_cursor = self.database_cursor

        database_cursor.execute('''
                                    INSERT INTO detections 
                                    (prev_id, last_id, outpath) 
                                    VALUES (?, ?, ?)
                                    ''', (prev_id,last_id,outpath,))

        database_conn.commit()

        rowid = database_cursor.lastrowid

        return rowid



    def add_detection_id(self,rowid, detection_id):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        database_cursor.execute('''
                                UPDATE records 
                                SET detection = (?) 
                                WHERE id = (?) 
                                ''', (detection_id, rowid,))
        database_conn.commit()
        

    def get_detection_by_id(self,detection_id):
        database_conn = self.database_conn
        database_cursor = self.database_cursor
        
        detection = database_cursor.execute('''
                                SELECT * 
                                FROM detections
                                WHERE id = (?)
                                ''', (detection_id,) ).fetchone()
        database_conn.commit()
        return detection
