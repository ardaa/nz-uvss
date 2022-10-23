import yaml
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading


import Operator
import Comparator

class Watcher:

    def __init__(self, directory=".", handler=FileSystemEventHandler()):

        self.observer = Observer()
        self.handler = handler
        self.directory = directory

    def run(self):
        self.observer.schedule(
            self.handler, self.directory, recursive=True)
        self.observer.start()
        print("\nWatcher Running in {}/\n".format(self.directory))
        try:
            while True:
                time.sleep(1)
        except:
            self.observer.stop()
        self.observer.join()
        print("\nWatcher Terminated\n")


class chassiscam_handler(FileSystemEventHandler):
    
    def on_created(self, event):
        chassis_operator = Operator.Operator(database_dir, storage_dir)
        status = chassis_operator.chassis(event.src_path)
        while not status:
                time.sleep(5)
                try:
                        status = chassis_operator.chassis(event.src_path)
                except:
                        pass
        del chassis_operator


class platecam_handler(FileSystemEventHandler):
    
    def on_created(self, event):
        plate_operator = Operator.Operator(database_dir, storage_dir)
        status = plate_operator.plate(event.src_path)
        while not status:
                time.sleep(1)
                try:
                        status = plate_operator.plate(event.src_path)
                except:
                        pass
        
        del plate_operator


def get_config():
    global storage_dir,platecam_dir,chassiscam_dir,database_dir
    try:
        with open("config.yaml", "r") as stream:
            try:
                a = yaml.safe_load(stream)
                storage_dir     = a['storage']
                database_dir    = a['database']
                platecam_dir    = a['platecam']
                chassiscam_dir  = a['chassiscam']

            except yaml.YAMLError as exc:
                print(exc)

    except FileNotFoundError as fnf:
        print("Konfigurasyon dosyasi", fnf.filename, "bulunamadi. Program durduruluyor")
        quit()






if __name__ == "__main__":
    
    #get configuration
    storage_dir     = str()
    database_dir    = str()
    platecam_dir    = str()
    chassiscam_dir  = str()
    
    get_config()

    #initialize and run directory watcher threads
    chassis_watcher = Watcher(directory=chassiscam_dir, handler=chassiscam_handler())
    plate_watcher = Watcher(directory=platecam_dir, handler=platecam_handler())

    x = threading.Thread(target=chassis_watcher.run, args=(), daemon=False)
    y = threading.Thread(target=plate_watcher.run, args=(), daemon=False)

    x.start()
    y.start()

    #initialize comparator and run thread
    
    #chassis_comparator = Comparator.Comparator(database_dir,storage_dir)
    #z = threading.Thread(target=chassis_comparator.check_last, args=(), daemon=False)

    #z.start()

    



