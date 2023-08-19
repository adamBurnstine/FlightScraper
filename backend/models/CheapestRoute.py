from ..extensions import db
from datetime import datetime

class Search(db.Model):
    __bind_key__ = 'cheapest_route'
    date_searched = db.Column(db.DateTime, primary_key=True, default=datetime.utcnow)
    start_loc = db.Column(db.String(), nullable=False)
    start_date = db.Column(db.String(), nullable=False)
    end_date = db.Column(db.String(), nullable=False)
    destinations = db.relationship('Destination', backref='search')
    flights = db.relationship('Flight', backref='search')
    routes = db.relationship('Route', backref='search')
    num_flights = db.Column(db.Integer)
    num_routes = db.Column(db.Integer)
    avg_route_price = db.Column(db.Float)

    def __repr__(self):
        out = f"Date Searched: {self.date_searched}; Start/End location: {self.start_loc}; Start Date: {self.start_date}; End Date: {self.end_date}; Destinations: {self.destinations}"
        if type(self.num_flights) != type(None):  out += f"; Num flights searched: {self.num_flights}"
        if type(self.num_routes) != type(None): out += f"; Num routes searched: {self.num_routes}"
        if type(self.avg_route_price) != type(None): out += f"; Average route price: {self.avg_route_price}"
        return out

class Destination(db.Model):
    __bind_key__ = 'cheapest_route'
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(), nullable=False)
    num_days = db.Column(db.Integer, nullable=False)
    search_date_searched = db.Column(db.DateTime, db.ForeignKey('search.date_searched'))

    def __repr__(self):
        return f"Destination: {self.location}; # of Days: {self.num_days}"

flight_route = db.Table('flight_route', 
                        db.Column('flight_id', db.Integer, db.ForeignKey('flight.id')), 
                        db.Column('route_id', db.Integer, db.ForeignKey('route.id')), 
                        bind_key='cheapest_route')


class Flight(db.Model):
    __bind_key__ = 'cheapest_route'
    
    id = db.Column(db.Integer, primary_key=True)
    dpt_airport = db.Column(db.String, nullable=False)
    arr_airport = db.Column(db.String, nullable=False)
    dpt_time = db.Column(db.String, nullable=False)
    arr_time = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    airline = db.Column(db.String, nullable=False)
    duration = db.Column(db.String, nullable=False)
    layover = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    url = db.Column(db.String, nullable=False)
    search_from = db.Column(db.String, nullable=False)
    search_to = db.Column(db.String, nullable=False)
    search_date_searched = db.Column(db.DateTime, db.ForeignKey('search.date_searched'))

    def __repr__(self):
        return f"\nId: {self.id}; From: {self.dpt_airport} at {self.dpt_time}; To: {self.arr_airport} at {self.arr_time}; On: {self.date}; Airline: {self.airline}; Price: {self.price}; Layover: {self.layover}; Duration: {self.duration}; Search from: {self.search_from}; Search to: {self.search_to}"

class Route(db.Model):
    __bind_key__ = 'cheapest_route'

    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Integer, nullable=False)
    search_date_searched = db.Column(db.DateTime, db.ForeignKey('search.date_searched'))
    flights = db.relationship('Flight', secondary=flight_route, backref='routes')

    def __repr__(self):
        return f"\nID: {self.id}; price: {self.price}; Flights: {self.flights}; Search: {self.search_date_searched}"