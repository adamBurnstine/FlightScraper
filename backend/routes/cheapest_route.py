import queue
from flask import Blueprint, abort, jsonify, request
from ..extensions import db
from datetime import date, datetime, timedelta


cheapest_route = Blueprint('cheapest_route', __name__)

@cheapest_route.route('/', methods=['GET', 'POST'])
def index():
    if (request.method == 'GET'):
        return 'Ok'
    if (request.method == 'POST'):
        urlQ = queue.Queue(0)
        try:
            #recieve input
            user_input = request.get_json()
            startDate, endDate, startLoc, destinations, tripLength = user_input.values()
            
            #validate data
            startDate = stringToDate(startDate)
            endDate = stringToDate(endDate)
            tripLength = endDate - startDate
            totDays = 0
            places = []
            minNumDays = tripLength.days
            for d in destinations:
                totDays += int(d['numDays'])
                places.append(d['destination'])
                minNumDays = min(minNumDays, int(d['numDays']))
            if (totDays >= tripLength.days):
                raise RuntimeError("Trip not long enough for number of days entered at each destination")
            if (tripLength.days < 3):
                raise RuntimeError("Trip not long enough. Must be at least 3 days")
            if (tripLength.days > 365):
                raise RuntimeError("Trip too long. Maximum trip length is 365 days")

            print(f"StartLoc: ", startLoc, "; startDate: ", startDate, "; endDate: ", endDate, "; destinations: ", destinations, "; tripLength: ", tripLength)

            #Next step: generate urls
            #Generate all urls leaving from startLoc on startDate
            for p in places:
                #urlQ.put(f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{p}%20from%20{startLoc}%20on%20{startDate}")
                urlQ.put(f"From: {startLoc}; To: {p}; On: {startDate}")
            #Generate all urls arriving to startLoc on endDate
            for p in places:
                #urlQ.put(f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{startLoc}%20from%20{p}%20on%20{endDate}")
                urlQ.put(f"From: {p}; To: {startLoc}; On: {endDate}")
            #Generate all other urls
            currDate = startDate + timedelta(days=minNumDays)
            while (endDate - currDate).days >= minNumDays:
                currDate += timedelta(days=1)
                for i, p in enumerate(places): 
                    for j, p2 in enumerate(places):
                        if i == j:
                            continue
                        #urlQ.put(f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{p2}%20from%20{p}%20on%20{currDate}")
                        urlQ.put(f"From: {p}; To: {p2}; On: {currDate}")



            while urlQ.empty() != True:
                print(urlQ.get())


            #NEXT STEPS: Scrape the urls for a flight and add to the db


            
        except RuntimeError as e:
            print(e)
            abort(400)

        #print(user_input)
        return jsonify("Post recieved")


def stringToDate(str):
    year = int(str[:4])
    month = int(str[5:7])
    day = int(str[8:10])
    return date(year, month, day)
