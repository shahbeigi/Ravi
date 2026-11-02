from pathlib import Path
from playwright.sync_api import sync_playwright
import json
P=Path(__file__).parent
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page(viewport={"width":1440,"height":1100},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.goto('http://127.0.0.1:8766/technical-walkthrough/walkthrough.html')
    page.wait_for_function('Object.keys(window.__timelines).length===6')
    page.evaluate('document.fonts.ready')
    assert page.locator('#notes-title').inner_text().startswith('01')
    page.locator('#play').click()
    page.wait_for_timeout(700)
    assert float(page.locator('#seek').input_value())>0
    page.locator('#play').click()
    for i in range(6):
        page.locator(f'.chapter[data-i="{i}"]').click()
        assert page.locator('#notes-title').inner_text().startswith(f'0{i+1}')
        page.evaluate(f'seek(scenes[{i}].start+scenes[{i}].duration-1)')
        page.locator('#screen').screenshot(path=str(P/f'qa-scene-{i+1}.png'))
    page.evaluate('seek(25.8);state(true)')
    page.wait_for_timeout(500)
    assert page.locator('#play').inner_text()=='Play'
    assert page.locator('#notes-title').inner_text().startswith('01')
    page.locator('#play').click()
    page.wait_for_timeout(100)
    assert page.locator('#notes-title').inner_text().startswith('02')
    page.locator('#play').click()
    page.locator('.chapter[data-i="4"]').click()
    page.evaluate('seek(146)')
    page.screenshot(path=str(P/'study-player.png'),full_page=True)
    assert not errors,errors
    print(json.dumps({'js_errors':errors,'chapters':6,'play_pause':'pass','chapter_auto_pause':'pass','resume_next_chapter':'pass','screenshots':'qa-scene-1..6.png'}))
    browser.close()
