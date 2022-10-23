from datetime import datetime
import os
import Database
import shutil
import yaml

class Operator():

    def __init__(self, db_storage, storage_dir):
        self.db = Database.Database(db_storage)
        self.storage_dir = storage_dir
        
    def get_config(self):
        try:
            with open("config.yaml", "r") as stream:
                try:
                    a = yaml.safe_load(stream)
                    storage_dir     = a['storage']
                    database_dir    = a['database']
                    platecam_dir    = a['platecam']
                    chassiscam_dir  = a['chassiscam']    

                    return (storage_dir, database_dir, platecam_dir, chassiscam_dir)
                except yaml.YAMLError as exc:
                    print(exc)  



        except FileNotFoundError as fnf:
            print("Konfigurasyon dosyasi", fnf.filename, "bulunamadi. Program durduruluyor")
            quit()


    def cleanup(self):

        dirs = self.get_config()
        platecamdir = os.path.abspath(dirs[2])
        chassiscamdir = os.path.abspath(dirs[3])
        plate_files = os.listdir(platecamdir)
        chassis_files = os.listdir(chassiscamdir)
        for f in plate_files:
            try:
                to_delete = os.path.join(platecamdir, f)
                if os.path.exists(to_delete):
                    os.remove(to_delete)
            except:
                pass
        

        for f in chassis_files:
            try:
                to_delete = os.path.join(chassiscamdir, f)
                if os.path.exists(to_delete):
                    os.remove(to_delete)
            except:
                pass
        return


    def plate(self, src_path):
        db = self.db
        storage_dir = self.storage_dir

        timenow = datetime.now()
        timestamp = int(timenow.timestamp())
        year    = str(timenow.year)
        month   = str(timenow.month)
        day     = str(timenow.day)

        img_path = os.path.join(storage_dir, year,month,day)
        if not os.path.exists(img_path):
            os.makedirs(img_path)
        
        status_tuple = db.get_status()

        plateimg    = status_tuple[1]
        frontimg    = status_tuple[2]
        chassisimg  = status_tuple[3]


        if plateimg == 1 and frontimg == 1 and chassisimg == 1:

            rowid = db.insert_record(timestamp)
            db.database_conn.commit()
            db.set_chassis_status(0)
            db.set_front_status(0)
            db.set_plate_status(0)
   
        status_tuple = db.get_status()

        plateimg    = status_tuple[1]
        frontimg    = status_tuple[2]
        chassisimg  = status_tuple[3]    
        

        if "plate" in src_path and plateimg == 0 :

            splitpath = src_path.split('.')
            plate = splitpath[0]
            rowid = db.get_row_id()

            dest_path = os.path.join(img_path, "{}_plate.png".format(rowid))
            shutil.move(src_path, dest_path)
            db.update_plate(rowid,plate)
            db.add_plate_img(rowid, str(os.path.abspath(dest_path)))
            db.database_conn.commit()
            db.set_plate_status(1)

            return True

        elif ("plate" not in src_path) and frontimg == 0 :

            rowid = db.get_row_id()

            dest_path = os.path.join(img_path, "{}_front.png".format(rowid))
            shutil.move(src_path, dest_path)
            
            db.add_front_img(rowid, str(os.path.abspath(dest_path)))
            db.database_conn.commit()

            db.set_front_status(1)

            return True

        status_tuple = db.get_status()

    

        plateimg    = status_tuple[1]
        frontimg    = status_tuple[2]
        chassisimg  = status_tuple[3]

        if plateimg == 1 and frontimg == 1 and chassisimg == 1:
            
            self.cleanup()
        
        if plateimg == 0:
            return False
        else:
            return True



    def chassis(self, src_path):
        db = self.db
        storage_dir = self.storage_dir


        timenow = datetime.now()
        timestamp = int(timenow.timestamp())
        year    = str(timenow.year)
        month   = str(timenow.month)
        day     = str(timenow.day)

        img_path = os.path.join(storage_dir, year,month,day)
        if not os.path.exists(img_path):
            os.makedirs(img_path)
        

        status_tuple = db.get_status()

    

        plateimg    = status_tuple[1]
        frontimg    = status_tuple[2]
        chassisimg  = status_tuple[3]


        rowid = db.get_row_id()
        dest_path = os.path.join(img_path, "{}_chassis.png".format(rowid))
        
        if chassisimg == 0:
            shutil.move(src_path, dest_path)

            db.add_chassis_img(rowid, str(os.path.abspath(dest_path)))
            db.database_conn.commit()
            db.set_chassis_status(1)
            
            chassisimg = 1
            
            if plateimg == 1 and frontimg == 1 and chassisimg == 1:
            
                self.cleanup()
        
            
            return True
        else:
             return False
        



