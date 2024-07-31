FROM python:3.9

ENV PYTHONUNBUFFERED 1
WORKDIR /opt/app/Pwa
# default-mysql-clientは`python manage.py test --parallel=4`などで並列テストした際、
# mysqldumpコマンドが存在しないとエラーになるため、インストールした。
RUN apt-get update && \
    apt-get -y install gcc && \
    apt-get -y install poppler-utils poppler-data && \
    apt-get -y install default-mysql-client && \
    apt-get -y install wkhtmltopdf && \
    apt-get -y install fonts-ipaexfont-gothic fonts-ipaexfont-mincho && \
    apt-get -y install openjdk-17-jdk && \
    apt-get -y install --no-install-recommends libreoffice-calc && \
    rm -rf /var/lib/apt/lists/* && \
    wget https://bootstrap.pypa.io/get-pip.py && \
    python get-pip.py

ADD ./requirements.txt /opt/app/Pwa
ADD ./wait-for-it.sh /opt/app/Pwa
RUN pip install sphinxcontrib-applehelp
RUN pip install -r requirements.txt
