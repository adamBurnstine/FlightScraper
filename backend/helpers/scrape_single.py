from bs4 import BeautifulSoup
from pyppeteer import launch
import asyncio

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
    layover = flightTag.find("span", class_="rGRiKd").text                                              # Layover information
    price = flightTag.find("div", class_=["YMlIz FpEdX", "YMlIz FpEdX jLMuyc"]).find("span").text       # Price
    price = int(price[1:])

    await asyncio.gather(
        page.waitForNavigation({'waitUntil': 'networkidle2'}),
        page.click('body > c-wiz > div > div > c-wiz > div > c-wiz > div > div > div > ul > li'),
    )
    flight_url = page.url  #URL to see more info about flight

    return {'dptTime': dptTime, 'arrTime': arrTime, 'airline': airline, 'duration': duration, 'dptAirport': dptAirport, 'arrAirport': arrAirport, 'layover': layover, 'price': price, 'flight_URL': flight_url}
