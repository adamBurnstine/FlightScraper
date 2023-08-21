from flask import Blueprint, abort, jsonify, request
from sqlalchemy import desc
from ..extensions import db
from ..models.SimpleSearch import SimpleSearch
from ..helpers.scrape_single import scrape
import asyncio

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
            searchInfo = SimpleSearch(start = user_input['start'], end=user_input['end'], date=user_input['date'], airline=flightInfo['airline'], 
                                      dptAirport=flightInfo['dptAirport'], arrAirport=flightInfo['arrAirport'], dptTime=flightInfo['dptTime'], arrTime=flightInfo['arrTime'], 
                                      duration=flightInfo['duration'], price=flightInfo['price'], layover=flightInfo['layover'], url=flightInfo['flight_URL'])
            db.session.add(searchInfo)
            db.session.commit()
            print("uploaded to database")
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

@simple_search.route('/history', methods=['GET'])
def history():
    searches = SimpleSearch.query.order_by(desc('dtSearched')).limit(50)
    history = []
    for search in searches:
        history.append({'dtSearched': search.dtSearched, 'searchDPT': search.start, 'searchARR': search.end, 'searchDate': search.date, 'airline': search.airline, 
                      'dptTime': search.dptTime, 'dptAirport': search.dptAirport, 'arrTime': search.arrTime, 'arrAirport': search.arrAirport, 
                      'duration': search.duration, 'price': search.price, 'layover': search.layover, 'flight_URL': search.url})
    return jsonify(history)