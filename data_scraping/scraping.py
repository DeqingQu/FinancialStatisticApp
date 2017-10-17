import requests
from time import sleep
from bs4 import BeautifulSoup
from datetime import datetime
import json

BASE_URL = "https://finance.google.com"

SEARCH_URL = "https://en.wikipedia.org/"
TARGET_URL = "https://en.wikipedia.org/wiki/Python_(programming_language)"

ticker_symbol = "HKG:0966"
related_companies = []


#   retrieve data from URL
def retrieve(url: str):
    """retrieves content at the specified url"""
    print("*", url)
    sleep(1)  # *never* web scrape faster than 1 request per second
    r = requests.get(url, verify=False)  # get the HTML; ignore SSL errors (present on this particular site)
    soup = BeautifulSoup(r.text, "lxml")  # parse the HTML
    return soup


def find_related_companies(symbol: str, base_url: str):
    url = base_url + '/finance?q=' + symbol
    #   get the link to related companies
    soup = retrieve(url)
    #   li.fjfe-nav-sub
    for li in soup.find_all('li', {"class": "fjfe-nav-sub"}):
        if li.text == "Related companies":
            related_companies_url = base_url + li.findChildren('a')[0].get('href')
    #   get the content of related companies from the new url
    soup = retrieve(related_companies_url)
    for script in soup.find_all('script'):
        print(script)
        print('\n')


def filter_links(url: str, base_url: str, search_url: str):
    soup = retrieve(url)
    links_after_filter = {}
    links_before_filter = soup.find_all('a')
    for link in links_before_filter:
        href_url = str(link.get('href'))
        #   is it a relevant URL to the BASE url?
        if href_url.startswith("/") and not href_url.startswith("//") and href_url.find('#') == -1:
            href_url = base_url + href_url
        if href_url.startswith(search_url):
            if not href_url in links_after_filter.keys():
                links_after_filter[href_url] = href_url
    return links_after_filter


def get_date(date_str: str):
    start_index = len('This page was last edited on ')
    date_str = date_str[start_index+1:]
    com_index = date_str.find(',')
    date_str = date_str[:com_index]
    modify_date = datetime.strptime(date_str, '%d %B %Y')
    return modify_date


def get_links_this_month(links: dict):
    href_count_in_a_month = 0
    for link in links:
        detail_soup = retrieve(link)
        for node in detail_soup.find_all('li'):
            if str(node.get('id')) == "footer-info-lastmod":
                time_str = node.string
                modified_date = get_date(time_str)
                now = datetime.now()
                if (now - modified_date).days < 30:
                    href_count_in_a_month += 1
                    # print('final result + %d' % href_count_in_a_month)
    print("Result %d" % href_count_in_a_month)


# links_filtered = filter_links(TARGET_URL, BASE_URL, SEARCH_URL)
# get_links_this_month(links_filtered)

find_related_companies(ticker_symbol, BASE_URL)