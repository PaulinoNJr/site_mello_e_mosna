"""Extract visible copy from the public reference bundle; not used at runtime."""
import json
import re
from pathlib import Path

source = Path('.reference/original.js').read_text(encoding='utf-8')
icons = dict(re.findall(r'(\w+)=I\(`([^`]+)`', source))

def cards(start, end):
    fragment = source[source.index(start):source.index(end, source.index(start))]
    return [dict(icon=icons[icon], title=title, description=description)
            for icon, title, description in re.findall(
                r'icon:(\w+),title:`([^`]+)`,description:`([^`]+)`', fragment)]

data = {
    'services': cards('var eh=', 'function th'),
    'differentials': cards('var nh=', 'function rh'),
    'benefits': re.findall(r'`([^`]+)`', source[source.index('var Sh='):source.index('function Ch')]),
    'testimonials': [dict(quote=q, author=a, role=r, initial=i) for q,a,r,i in re.findall(
        r'quote:`([^`]+)`,author:`([^`]+)`,role:`([^`]+)`,initial:`([^`]+)`',
        source[source.index('var wh='):source.index('function Th')])],
}
Path('src/data.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
