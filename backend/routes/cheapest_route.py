from flask import Blueprint, abort, request
from ..extensions import db
from datetime import date, datetime, timedelta
from ..helpers.return_cheapest_search import format_return
from ..helpers.generate_routes import generate_paths
from ..models.CheapestRoute import Search, Destination, Flight, Route, flight_route
from pyppeteer import launch
from bs4 import BeautifulSoup
import asyncio
import queue

cheapest_route = Blueprint('cheapest_route', __name__)

@cheapest_route.route('/toggle_favorite/<route_id>', methods=['POST'])
def toggle_favorite(route_id):
    route_id=int(route_id)
    route = Route.query.filter_by(id =route_id).first()
    print(route_id)
    if route.favorited: 
        route.favorited = False
    else:
        route.favorited = True

    db.session.commit()
    searchInfo = route.search

    return format_return(searchInfo)

@cheapest_route.route('/', methods=['GET', 'POST'])
def index():
    if (request.method == 'GET'):
        return 'Ok'
    if (request.method == 'POST'):
        try:
            #recieve input
            user_input = request.get_json()
            startDate, endDate, startLoc, destinations, tripLength = user_input.values()
            
            #validate data
            start_date_time = string_to_datetime(startDate)
            startDate = string_to_date(startDate)
            end_date = string_to_date(endDate)
            tripLength = end_date - startDate
            tot_days = 0
            locations = []
            min_num_days = tripLength.days
            searchInfo = Search(start_loc=startLoc, start_date=startDate, end_date=end_date)
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
            
            #Generate URLs
            urlQ = generate_urls(locations, startLoc, startDate, end_date, min_num_days)
            searchInfo.num_flights = urlQ.qsize()

            #Scrape URLs and add flights to db
            asyncio.run(scrape_all(urlQ, searchInfo))

            #Create routes
            flex = tripLength.days - tot_days
            print("Generating routes")
            generate_paths(locations, 0, len(locations), startLoc, flex, start_date_time, searchInfo)
            print("Routes generated!")

            #Search metrics
            searchInfo.num_routes = Route.query.filter(Route.search == searchInfo).count()
            tot_price = db.session.query(db.func.sum(Route.price)).filter(Route.search == searchInfo).scalar()
            searchInfo.avg_route_price = tot_price / searchInfo.num_routes
            db.session.commit()

            #Format return and return
            return format_return(searchInfo)
        
        except RuntimeError as e:
            print(e)
            abort(400)
        except Exception as e:
            print(e)
            abort(500)

def generate_urls(places, start_loc, start_date, end_date, min_num_days):
    urlQ = queue.Queue(0)
    curr_date = start_date + timedelta(days=min_num_days)
    for p in places:
        urlQ.put({'search_from': start_loc, 'search_to': p.location, 'url': f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{p.location}%20from%20{start_loc}%20on%20{start_date}"})
    for p in places:
        urlQ.put({'search_from': p.location, 'search_to': start_loc, 'url':f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{start_loc}%20from%20{p.location}%20on%20{end_date}"})
    while (end_date - curr_date).days >= min_num_days:
        for i, p in enumerate(places): 
            for j, p2 in enumerate(places):
                if i == j:
                    continue
                urlQ.put({'search_from': p.location, 'search_to': p2.location, 'url':f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{p2.location}%20from%20{p.location}%20on%20{curr_date}"})
        curr_date += timedelta(days=1)

    print('URLs generated!')
    return urlQ

async def scrape_all(urlQ: queue.Queue, search_info):
    print("scraping")
    num_urls = urlQ.qsize()
    urls_done = 0
    browser = await launch(handleSIGINT=False, handleSIGTERM=False, handleSIGHUP=False)
    while urlQ.empty() != True:
        print(urls_done, '/', num_urls)
        page = await browser.newPage()
        url_info = urlQ.get()
        url = url_info['url']
        await page.goto(url, {'waitUntil': 'domcontentloaded'})
        content = await page.content()
        soup = BeautifulSoup(content, "html.parser")
        flight_tag = soup.find("li", class_="pIav2d")
        if type(flight_tag) == type(None):
            raise RuntimeError(f"Url not rendering correct page. Try modifying search. Bad URL: {url}")

        dpt_time = flight_tag.find("div", class_="wtdjmc YMlIz ogfYpf tPgKwe").text.replace('\u202f', '')     # Departure time and date 
        arr_time = flight_tag.find("div", class_="XWcVob YMlIz ogfYpf tPgKwe").text.replace('\u202f', '')     # Arrival time and date
        airline = flight_tag.find("span", class_="h1fkLb").span.text                                          # Airline
        duration = flight_tag.find("div", class_="gvkrdb AdWm1c tPgKwe ogfYpf").text                          # Duration
        dpt_airport = flight_tag.find("div", class_="G2WY5c sSHqwe ogfYpf tPgKwe").text                       # Departure airport
        arr_airport = flight_tag.find("div", class_="c8rWCd sSHqwe ogfYpf tPgKwe").text                       # Arrival Airport
        layover = flight_tag.find("span", class_="rGRiKd").text                                               # Layover information
        price = flight_tag.find("div", class_=["YMlIz FpEdX", "YMlIz FpEdX jLMuyc"]).find("span").text        # Price
        price = int(price[1:].replace(',', ''))
        search_from = url_info['search_from']
        search_to = url_info['search_to']
        date = string_to_date(url[-10:])

        await asyncio.gather(
            page.waitForNavigation({'waitUntil': 'networkidle2'}),
            page.click('body > c-wiz > div > div > c-wiz > div > c-wiz > div > div > div > ul > li')
        )
        flight_url = page.url  #URL to see more info about flight

        flight_info = Flight(search_from=search_from, search_to=search_to, dpt_airport=dpt_airport, arr_airport=arr_airport, dpt_time=dpt_time, arr_time=arr_time, date=date, airline=airline, duration=duration, layover=layover, price=price, url=flight_url, search=search_info)
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
