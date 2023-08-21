from flask import Blueprint, abort, request
from ..extensions import db
from ..helpers.return_cheapest_search import format_return
from ..helpers.generate_routes import generate_paths
from ..helpers.generate_urls import generate_urls
from ..helpers.string_to_date import string_to_date, string_to_datetime
from ..helpers.scrape_all import scrape_all
from ..models.CheapestRoute import Search, Destination, Route
import asyncio

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