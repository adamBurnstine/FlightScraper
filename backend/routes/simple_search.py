from flask import Blueprint, abort, jsonify, make_response, request
from sqlalchemy import desc
from ..extensions import db
from datetime import date, datetime
from ..models.SimpleSearch import SimpleSearch
import asyncio
from pyppeteer import launch
from bs4 import BeautifulSoup

simple_search = Blueprint("simple_search", __name__) 

@simple_search.route('/', methods=['GET', 'POST'])
def index():
    if (request.method == 'GET'):
        return 'Ok'
    if (request.method == 'POST'):
        user_input = request.get_json()

        try:
            url = f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{user_input['end']}%20from%20{user_input['start']}%20on%20{user_input['date']}"
            flightInfo = asyncio.run(scrape(url))
            searchInfo = SimpleSearch(start = user_input['start'], end=user_input['end'], 
                                      date=user_input['date'], airline=flightInfo['airline'], 
                                      dptAirport=flightInfo['dptAirport'], arrAirport=flightInfo['arrAirport'], 
                                      dptTime=flightInfo['dptTime'], arrTime=flightInfo['arrTime'], 
                                      duration=flightInfo['duration'], price=flightInfo['price'], 
                                      layover=flightInfo['layover'], url=flightInfo['flight_URL'])
            db.session.add(searchInfo)
            db.session.commit()
            print("uploaded to database")
            print(searchInfo.url)
            return flightInfo
        except RuntimeError as e:
            print(e)
            print("Page to be scraped not rendered as expected. Try modifying search")
            db.session.rollback()
            abort(418)
        except AttributeError as e:
            print(e)
            print("Error: Error parsing flight data from html document")
            db.session.rollback()
            abort(500)
        except KeyError as e:
            print(e)
            db.session.rollback()
            abort(500)
        except Exception as e:
            print(e)
            db.session.rollback()
            abort(400)


async def scrape(url):
    browser = await launch(handleSIGINT=False, handleSIGTERM=False, handleSIGHUP=False)
    page = await browser.newPage()
    await page.goto(url, {'waitUntil': 'domcontentloaded'})

    content = await page.content()
    soup = BeautifulSoup(content, "html.parser")
    flightTag = soup.find("li", class_="pIav2d")
    if type(flightTag) == type(None):
        raise RuntimeError("Url not working properly")
    
    dptTime = flightTag.find("div", class_="wtdjmc YMlIz ogfYpf tPgKwe").text.replace('\u202f', '')     # Departure time and date 
    arrTime = flightTag.find("div", class_="XWcVob YMlIz ogfYpf tPgKwe").text.replace('\u202f', '')     # Arrival time and date
    airline = flightTag.find("span", class_="h1fkLb").span.text                                         # Airline
    duration = flightTag.find("div", class_="gvkrdb AdWm1c tPgKwe ogfYpf").text                         # Duration
    dptAirport = flightTag.find("div", class_="G2WY5c sSHqwe ogfYpf tPgKwe").text                       # Departure airport
    arrAirport = flightTag.find("div", class_="c8rWCd sSHqwe ogfYpf tPgKwe").text                       # Arrival Airport
    layover = flightTag.find("span", class_="rGRiKd").text                                              # Layover information #FIXME add layover information if I find a way that doesn't require too much time to execute
    price = flightTag.find("div", class_=["YMlIz FpEdX", "YMlIz FpEdX jLMuyc"]).find("span").text       # Price #FIXME make sure this continues to work for a while
    price = int(price[1:])

    await asyncio.gather(
        page.waitForNavigation({'waitUntil': 'networkidle2'}),
        page.click('body > c-wiz > div > div > c-wiz > div > c-wiz > div > div > div > ul > li'),
    )

    flight_url = page.url  #URL to see more info about flight

    return {'dptTime': dptTime, 'arrTime': arrTime, 'airline': airline, 'duration': duration, 'dptAirport': dptAirport, 'arrAirport': arrAirport, 'layover': layover, 'price': price, 'flight_URL': flight_url}


@simple_search.route('/history', methods=['GET'])
def history():
    searches = SimpleSearch.query.order_by(desc('dtSearched')).limit(50)
    #print(searches)
    history = []
    for search in searches:
        print(search.dtSearched)
        history.append({'dtSearched': search.dtSearched, 'searchDPT': search.start, 'searchARR': search.end, 'searchDate': search.date, 'airline': search.airline, 
                      'dptTime': search.dptTime, 'dptAirport': search.dptAirport, 'arrTime': search.arrTime, 'arrAirport': search.arrAirport, 
                      'duration': search.duration, 'price': search.price, 'layover': search.layover, 'flight_URL': search.url})
    print(type(history))
    return jsonify(history)


# #Data validation - pydantics - if I want to use
# class SimpleSearchInput(BaseModel):
#     start: string
#     end: string
#     date: date
#     searchDate: datetime = datetime.utcnow


# class FlightInfo(BaseModel):
#     dptTime: datetime #subject to change
#     arrTime: datetime #subject to change to string    reason for change: string is easier to implement, datetime means could base the number of days based on the arrival date if the flight lands a different date
#     price: conint(gt=0, lt=10000)
#     arrAirport: string
#     dptAirport: string
#     layover: string
#     layoverInfo: [] | None
#     airline: string
#     duration: string #could change to a number of minutes
#     url: string
