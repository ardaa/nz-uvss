import os
os.system("docker load -i ftp_image.docker")
os.system("docker run --detach --restart always --env FTP_PASS=123 --env FTP_USER=user --name my-ftp-server --publish 20-21:20-21/tcp --publish 40000-40009:40000-40009/tcp --volume C:/temp:/home/user garethflowers/ftp-server")