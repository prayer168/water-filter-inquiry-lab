from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "images" / "hero-lab.webp"
OUTPUT = ROOT / "public" / "assets" / "images" / "social-preview.png"
FONT_REGULAR = Path(r"C:\Windows\Fonts\msjh.ttc")
FONT_BOLD = Path(r"C:\Windows\Fonts\msjhbd.ttc")


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size, index=0)


source = Image.open(SOURCE).convert("RGB")
scale = max(1200 / source.width, 630 / source.height)
resized = source.resize(
    (round(source.width * scale), round(source.height * scale)),
    Image.Resampling.LANCZOS,
)
left = (resized.width - 1200) // 2
top = max(0, (resized.height - 630) // 2 - 18)
canvas = resized.crop((left, top, left + 1200, top + 630)).convert("RGBA")

# Preserve the experiment scene on the right while creating a quiet text field.
overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
pixels = overlay.load()
for x in range(1200):
    if x <= 515:
        alpha = 238
    elif x >= 790:
        alpha = 32
    else:
        alpha = round(238 - (x - 515) * (206 / 275))
    for y in range(630):
        pixels[x, y] = (11, 43, 34, alpha)
canvas = Image.alpha_composite(canvas, overlay)

draw = ImageDraw.Draw(canvas)
amber = "#F2C66D"
paper = "#FFF9EC"
sage = "#C8D8CF"

draw.rounded_rectangle((56, 46, 126, 116), radius=35, outline=amber, width=2)
draw.text((91, 81), "WF", font=font(FONT_BOLD, 22), fill=paper, anchor="mm")
draw.text((150, 56), "WATER FILTER INQUIRY LAB", font=font(FONT_BOLD, 18), fill=amber)
draw.text((56, 165), "自製濾水器", font=font(FONT_BOLD, 66), fill=paper)
draw.text((56, 245), "探究", font=font(FONT_BOLD, 66), fill=paper)
draw.text((59, 352), "設計・測試・用證據改良", font=font(FONT_BOLD, 28), fill=sage)

draw.rounded_rectangle((56, 432, 454, 492), radius=30, fill="#A44D35")
draw.text((255, 462), "清澈 ≠ 可安全飲用", font=font(FONT_BOLD, 25), fill=paper, anchor="mm")
draw.text((59, 538), "適合國小高年級至國中七年級", font=font(FONT_REGULAR, 21), fill=paper)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
canvas.convert("RGB").save(OUTPUT, format="PNG", optimize=True)
print(f"{OUTPUT} | {canvas.width}x{canvas.height}")
