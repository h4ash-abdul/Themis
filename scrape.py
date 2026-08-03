import asyncio
import re
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        print("Navigating...")
        await page.goto('https://app.spline.design/community/file/3afbbf73-d552-4dcc-a0fb-73d369a63e71', wait_until='networkidle')
        await asyncio.sleep(5) # Let it render
        
        content = await page.content()
        
        # Search for spline URLs
        urls = re.findall(r'https://(?:my|prod)\.spline\.design/[a-zA-Z0-9-]+/', content)
        if urls:
            print("FOUND SPLINE URLS:")
            for u in set(urls):
                print(u)
        else:
            print("No spline URLs found in the DOM.")
            
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
