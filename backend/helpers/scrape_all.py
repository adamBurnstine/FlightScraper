from ..helpers.string_to_date import string_to_date
from ..models.CheapestRoute import Flight
from ..extensions import db
from bs4 import BeautifulSoup
from pyppeteer import launch
import asyncio
import queue
 
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