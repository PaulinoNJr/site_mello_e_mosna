"""Optional asset regeneration; requires Pillow. Generated files are already included."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

assets = Path('public/assets')
photo = ImageOps.exif_transpose(Image.open(assets / 'escritorio.jpg')).convert('RGB')
for width in (600, 900):
    resized = photo.copy()
    resized.thumbnail((width, 2000), Image.Resampling.LANCZOS)
    resized.save(assets / f'escritorio-{width}.webp', 'WEBP', quality=78, method=6)

card = Image.new('RGB', (1200, 630), '#0a182e')
draw = ImageDraw.Draw(card)
gold = '#d2b171'
draw.rectangle((0, 0, 1200, 10), fill=gold)
draw.rectangle((80, 108, 160, 188), fill=gold)
draw.line([(120, 126), (143, 135), (143, 153), (136, 168), (120, 179), (104, 168), (97, 153), (97, 135), (120, 126)], fill='#0a182e', width=4)
bold = ImageFont.truetype(str(assets / 'fonts/montserrat-800.ttf'), 58)
small = ImageFont.truetype(str(assets / 'fonts/montserrat-600.ttf'), 24)
body = ImageFont.truetype(str(assets / 'fonts/montserrat-400.ttf'), 28)
draw.text((80, 235), 'MELLO & MOSNA', font=bold, fill='white')
draw.text((80, 318), 'CORRETORA DE SEGUROS', font=small, fill=gold)
draw.text((80, 425), 'Hortolândia · Sumaré · Campinas', font=body, fill='white')
draw.text((80, 475), 'Atendimento em todo o Brasil', font=body, fill='#bac2ce')
card.save(assets / 'compartilhamento.png', optimize=True)
