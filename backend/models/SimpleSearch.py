#from flask import Blueprint
from ..extensions import db
from datetime import datetime

class SimpleSearch(db.Model):
    #Search info
    dtSearched = db.Column(db.DateTime, primary_key=True, default=datetime.utcnow)
    start = db.Column(db.String(5), nullable=False)
    end = db.Column(db.String(5), nullable=False)
    date = db.Column(db.String(10), nullable=False)

    #Flight info
    airline = db.Column(db.String, nullable=False)
    dptAirport = db.Column(db.String, nullable=False)
    arrAirport = db.Column(db.String, nullable=False)
    dptTime = db.Column(db.String, nullable=False)
    arrTime = db.Column(db.String, nullable=False)
    duration = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    layover = db.Column(db.String, nullable=False)
    url = db.Column(db.String, nullable=False)
    #add layover info if its feasible

    def __repr__(self):
        return  f"Flight info: flight from {self.start} to {self.to} on {self.date} using {self.airline} for ${self.price}.)"
    
    