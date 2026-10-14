"""Optional asset regeneration; requires Pillow. Generated files are already included."""
from pathlib import Path
from PIL import Image, ImageOps

assets = Path('public/assets')
photo = ImageOps.exif_transpose(Image.open(assets / 'escritorio.jpg')).convert('RGB')
for width in (600, 900):
    resized = photo.copy()
    resized.thumbnail((width, 2000), Image.Resampling.LANCZOS)
    resized.save(assets / f'escritorio-{width}.webp', 'WEBP', quality=78, method=6)
