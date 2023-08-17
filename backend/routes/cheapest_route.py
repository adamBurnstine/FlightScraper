from flask import Blueprint, abort, jsonify, request
from ..extensions import db
from datetime import date, datetime, timedelta
from ..models.CheapestRoute import Search, Destination, Flight, Route, flight_route
from pyppeteer import launch
from bs4 import BeautifulSoup
import asyncio
import queue


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
            start_date_time = string_to_datetime(startDate)
            startDate = string_to_date(startDate)
            endDate = string_to_date(endDate)
            tripLength = endDate - startDate
            tot_days = 0
            locations = []
            min_num_days = tripLength.days

            searchInfo = Search(start_loc=startLoc, start_date=startDate, end_date=endDate)
            db.session.add(searchInfo)

            for d in destinations:
                tot_days += int(d['numDays'])
                dst = Destination(location=d['destination'], num_days=d['numDays'], search=searchInfo)
                db.session.add(dst)
                locations.append(dst)
                min_num_days = min(min_num_days, int(d['numDays']))
            
            if (tot_days > tripLength.days):
                raise RuntimeError("Trip not long enough for number of days entered at each destination")
            if (tripLength.days < 3):
                raise RuntimeError("Trip not long enough. Must be at least 3 days")
            if (tripLength.days > 365):
                raise RuntimeError("Trip too long. Maximum trip length is 365 days")

            #print(f"StartLoc: ", startLoc, "; startDate: ", startDate, "; endDate: ", endDate, "; destinations: ", destinations, "; tripLength: ", tripLength)
            
            #Generate URLs
            urlQ = generate_urls(locations, startLoc, startDate, endDate, min_num_days)
            #Scrape URLs and add flights to db
            asyncio.run(scrape_all(urlQ, searchInfo))
        

            #db.session.commit()
            #flight = Flight.query.filter(Flight.search == searchInfo, Flight.date == datetime(2023, 8, 20), Flight.dpt_airport == "LAX", Flight.arr_airport == 'ABE').first()
            #print(flight)
            
            flex = tripLength.days - tot_days
            generate_paths(locations, 0, len(locations), startLoc, flex, start_date_time, searchInfo)

            
        except RuntimeError as e:
            print(e)
            abort(400)

        #print(user_input)
        return jsonify("Post recieved")

def generate_routes(path, curr_date, flexibility, route, curr_loc, start_loc, search_info):
    if flexibility == 0 and len(path) == 0:
        #route.append(f"from {curr_loc} to {start_loc} on {curr_date}") #FIXME append the flight details
        flight = Flight.query.filter(Flight.search == search_info, Flight.date == curr_date, Flight.search_from == curr_loc, Flight.search_to == start_loc).first()
        route.append(flight)
        print(route, "\n\n")
    
    else:
        if flexibility > 0 and route != []:
            generate_routes(path, curr_date + timedelta(days=1), flexibility - 1, route, curr_loc, start_loc, search_info)
        if len(path) != 0:
            new_route = route[:]
            #new_route.append(f"from {curr_loc} to {path[0].location} on {curr_date}") #FIXME
            flight = Flight.query.filter(Flight.search == search_info, Flight.date == curr_date, Flight.search_from == curr_loc, Flight.search_to == path[0].location).all()
            new_route.append(flight)
            #print('\n\n', flight)
            new_date = curr_date + timedelta(days=int(path[0].num_days))
            new_loc = path[0].location
            new_path = path[1:]
            generate_routes(new_path, new_date, flexibility, new_route, new_loc, start_loc, search_info)

def generate_paths(dsts, l, r, start_loc, flexibility, start_date, search_info):
    if l == r:
        #print(dsts)
        generate_routes(dsts, start_date, flexibility, [], start_loc, start_loc, search_info)
    else: 
        for i in range(l, r):
            dsts[l], dsts[i] = dsts[i], dsts[l]
            generate_paths(dsts, l+1, r, start_loc, flexibility, start_date, search_info)
            dsts[l], dsts[i] = dsts[i], dsts[l]

def generate_urls(places, start_loc, start_date, end_date, min_num_days):
    urlQ = queue.Queue(0)
    for p in places:
        urlQ.put({'search_from': start_loc, 'search_to': p.location, 'url': f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{p.location}%20from%20{start_loc}%20on%20{start_date}"})
        #urlQ.put(f"From: {startLoc}; To: {p.location}; On: {startDate}")
    for p in places:
        urlQ.put({'search_from': p.location, 'search_to': start_loc, 'url':f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{start_loc}%20from%20{p.location}%20on%20{end_date}"})
        #urlQ.put(f"From: {p.location}; To: {startLoc}; On: {endDate}")
    curr_date = start_date + timedelta(days=min_num_days)
    #print(curr_date)
    while (end_date - curr_date).days >= min_num_days:
        for i, p in enumerate(places): 
            for j, p2 in enumerate(places):
                if i == j:
                    continue
                urlQ.put({'search_from': p.location, 'search_to': p2.location, 'url':f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{p2.location}%20from%20{p.location}%20on%20{curr_date}"})
                #urlQ.put(f"From: {p.location}; To: {p2.location}; On: {curr_date}")
        curr_date += timedelta(days=1)

    print('URLs generated!')
    return urlQ
    # while urlQ.empty() != True:
    #   print(urlQ.get()['url'])

async def scrape_all(urlQ: queue.Queue, searchInfo):
    num_urls = (urlQ.qsize())
    urls_done = 0
    browser = await launch(handleSIGINT=False, handleSIGTERM=False, handleSIGHUP=False)
    while urlQ.empty() != True:
        print(urls_done, '/', num_urls)
        page = await browser.newPage()
        urlInfo = urlQ.get()
        url = urlInfo['url']
        await page.goto(url, {'waitUntil': 'domcontentloaded'})
        content = await page.content()
        soup = BeautifulSoup(content, "html.parser")
        flightTag = soup.find("li", class_="pIav2d")
        if type(flightTag) == type(None):
            raise RuntimeError(f"Url not rendering correct page. Try modifying search. Bad URL: {url}")

        dpt_time = flightTag.find("div", class_="wtdjmc YMlIz ogfYpf tPgKwe").text.replace('\u202f', '')     # Departure time and date 
        arr_time = flightTag.find("div", class_="XWcVob YMlIz ogfYpf tPgKwe").text.replace('\u202f', '')     # Arrival time and date
        airline = flightTag.find("span", class_="h1fkLb").span.text                                         # Airline
        duration = flightTag.find("div", class_="gvkrdb AdWm1c tPgKwe ogfYpf").text                         # Duration
        dpt_airport = flightTag.find("div", class_="G2WY5c sSHqwe ogfYpf tPgKwe").text                       # Departure airport
        arr_airport = flightTag.find("div", class_="c8rWCd sSHqwe ogfYpf tPgKwe").text                       # Arrival Airport
        layover = flightTag.find("span", class_="rGRiKd").text                                              # Layover information #FIXME add layover information if I find a way that doesn't require too much time to execute
        price = flightTag.find("div", class_=["YMlIz FpEdX", "YMlIz FpEdX jLMuyc"]).find("span").text       # Price #FIXME make sure this continues to work for a while
        price = int(price[1:].replace(',', ''))
        search_from = urlInfo['search_from']
        search_to = urlInfo['search_to']
        date = string_to_date(url[-10:])

        await asyncio.gather(
        page.waitForNavigation({'waitUntil': 'networkidle2'}),
        page.click('body > c-wiz > div > div > c-wiz > div > c-wiz > div > div > div > ul > li'),
        )
        flight_url = page.url  #URL to see more info about flight

        flight_info = Flight(search_from=search_from, search_to=search_to, dpt_airport=dpt_airport, arr_airport=arr_airport, dpt_time=dpt_time, arr_time=arr_time, date=date, airline=airline, duration=duration, layover=layover, price=price, url=flight_url, search=searchInfo)
        db.session.add(flight_info)
        urls_done += 1
        await page.close()

    print("Successfully scraped!")
    await browser.close()
    return


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
