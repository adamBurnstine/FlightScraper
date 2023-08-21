from datetime import date, datetime

def string_to_date(str):
    year = int(str[:4])
    month = int(str[5:7])
    day = int(str[8:10])
    return date(year, month, day)

def string_to_datetime(str):
    year = int(str[:4])
    month = int(str[5:7])
    day = int(str[8:10])
    return datetime(year, month, day)