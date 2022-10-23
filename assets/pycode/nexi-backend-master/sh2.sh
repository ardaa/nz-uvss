rm -r Storage/2022/
rm Storage/Database/*
rm ChassisCam/*
rm PlateCam/*
python db_init.py
sqlitebrowser Storage/Database/records.db &
clear
python backend.py
