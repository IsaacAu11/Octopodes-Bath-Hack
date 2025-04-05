import requests

url = "http://127.0.0.1:8000/start"
payload = {
    "locations": [
        {
            "name": "Old Town Library",
            "description": "A Victorian-era building filled with dusty tomes and creaking floorboards",
            "characters": ["Sarah O'Connor"]
        },
        {
            "name": "The Golden Wok Restaurant",
            "description": "A bustling Asian fusion restaurant with modern decor",
            "characters": ["Marcus Chen"]
        }
    ],
    "characters": [
        ["Emma Thompson", "Detective"],
        ["Marcus Chen", "Chef"],
        ["Sarah O'Connor", "Librarian"],
        ["James Wilson", "Museum Curator"],
        ["Luna Martinez", "Artist"]
    ]
}
response = requests.post(url, json=payload)
print(response.json())
