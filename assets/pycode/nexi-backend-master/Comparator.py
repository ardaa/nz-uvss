import time
import Database

class Comparator:

    def __init__(self, db_storage, storage_dir):
        self.db = Database.Database(db_storage)
        self.storage_dir = storage_dir

    def check_last(self):

        while True:
            status = self.db.get_status()
            if 0 not in status:
                last = self.db.get_last_db_entry()
                last_id = last[0]
                if last[-1] is None:    
                    plate = last[1]

                    last_second = self.db.get_last_second_record_id_plate(plate)

                    last_two_ids = (last_second, last)

                    detection_id = self.compare(last_two_ids)

                    if detection_id != 0:
                        self.db.add_detection_id(last_id, detection_id)

                    
            else:
                time.sleep(5)




    def compare(self, prev_id, last_id):



        #BURAYA KIYASLAMA YAZILACAK

        #YAKALANAN FARK DOSYA OUTPUT ISMI last_id_detection.png gibi yazin
        #ornegin 379 gecis ihlaliyse 379_detection.png
        #storage altindaki pathe yazarsiniz

        #diger fotolardaki imgpath ornegi

        '''
        timenow = datetime.now()
        timestamp = int(timenow.timestamp())
        year    = str(timenow.year)
        month   = str(timenow.month)
        day     = str(timenow.day)

        img_path = os.path.join(storage_dir, year,month,day)
        if not os.path.exists(img_path):
            os.makedirs(img_path)

        dest_path = os.path.join(img_path, "{}_plate.png".format(rowid))
        

        '''


        ##if detected


        ##insert new detection

        #detection_id = self.db.insert_detection(prev_id, last_id, img_outpath)
        #return detection_id

        #else return 0

        pass