from flask import render_template, request
import requests


def home_view():
    return render_template("base.html", data=1)