from asyncore import loop
from flask import Blueprint, abort, jsonify, make_response, request
from pydantic import BaseModel, conint
from datetime import date, datetime
from ..models.SimpleSearch import SimpleSearch
import asyncio
from pyppeteer import launch
from bs4 import BeautifulSoup


simple_search = Blueprint("simple_search", __name__) 

@simple_search.route('/', methods=['GET', 'POST'])
async def index():
    if (request.method == 'GET'):
        return 'Ok'
    if (request.method == 'POST'):
        user_input = request.get_json()

        #validate input, generate url, scrape, add to database

        #validation done on front end

        #create url
        try:
            url = f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{user_input['end']}%20from%20{user_input['start']}%20on%20{user_input['date']}"
            print(url)
            asyncio.get_event_loop().run_until_complete(scrape(url))
        except KeyError:
            print("Unexpected error: Failed to create url")
            abort(500)
        except Exception as e:
            print(e)



        print(user_input)
        return user_input



async def scrape(url):
    browser = await launch()
    page = await browser.newPage()
    await page.goto(url, {'waitUntil': 'domcontentloaded'}) #FIXME need to make sure the url was correct

    content = await page.content()
    soup = BeautifulSoup(content, "html.parser")
    flightTag = soup.find("li", class_="pIav2d")
   
    dptTime = flightTag.find("div", class_="wtdjmc YMlIz ogfYpf tPgKwe").text       # Departure time and date 
    arrTime = flightTag.find("div", class_="XWcVob YMlIz ogfYpf tPgKwe").text       # Arrival time and date
    airline = flightTag.find("span", class_="h1fkLb").span.text                     # Airline
    duration = flightTag.find("div", class_="gvkrdb AdWm1c tPgKwe ogfYpf").text     # Duration
    dptAirport = flightTag.find("div", class_="G2WY5c sSHqwe ogfYpf tPgKwe").text   # Departure airport
    arrAirport = flightTag.find("div", class_="c8rWCd sSHqwe ogfYpf tPgKwe").text   # Arrival Airport
    layovers = flightTag.find("span", class_="rGRiKd").text                         # Layover information #FIXME add layover information if I find a way that doesn't require too much time to execute
    price = flightTag.find("div", class_="YMlIz FpEdX jLMuyc").find("span").text    # Price

    await asyncio.gather(
        page.click('body > c-wiz > div > div > c-wiz > div > c-wiz > div > div > div > ul > li'),
        page.waitForNavigation({'waitUntil': 'networkidle2'}),
    )

    url = page.url  #URL to see more info about flight

    print(f"Departing from {dptAirport} at {dptTime} and arriving at {arrAirport} at {arrTime}. Airline(s): {airline}. Flight duration: {duration}, Layovers: {layovers}, Price: {price}")

    


# Implement this function after basic functionality working
# @simple_search.route('/history', methods=['GET'])
# def history():







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
