import fitz
doc = fitz.open("weezmo.pdf")
page = doc[0]
rects = page.search_for("04-05-2026")
print(f"Page rect: {page.rect}")
print(f"Coordinates: {rects}")
