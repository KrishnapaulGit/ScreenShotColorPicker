from PIL import Image, ImageDraw

# Create image
img = Image.new('RGB', (600, 450), 'white')
draw = ImageDraw.Draw(img)

# Yellow box - AUTO
draw.rectangle([(40, 80), (160, 140)], fill='#FFFF99', outline='#FF6600', width=3)
draw.text((50, 95), 'AUTO', fill='black')

# Red box - REPAIR  
draw.rectangle([(190, 55), (370, 165)], fill='#FF9999', outline='#AA0000', width=3)
draw.text((210, 100), 'REPAIR', fill='black')

# Purple box - INVOICE
draw.rectangle([(385, 55), (605, 165)], fill='#BB99CC', outline='#6600AA', width=3)
draw.text((405, 100), 'INVOICE', fill='black')

# Invoice No
draw.rectangle([(170, 195), (350, 245)], fill='#FF9999', outline='#AA0000', width=2)
draw.text((180, 210), 'Invoice No.', fill='black')
draw.rectangle([(365, 195), (515, 245)], fill='#5577FF', outline='#0000AA', width=2)
draw.text((375, 210), '10000', fill='black')

# Invoice Date
draw.rectangle([(170, 270), (350, 320)], fill='#FF99CC', outline='#AA0055', width=2)
draw.text((180, 285), 'Invoice Date:', fill='black')
draw.text((375, 285), '01/12/2023', fill='black')

# Due Date
draw.rectangle([(170, 345), (350, 395)], fill='#99FF99', outline='#00AA00', width=2)
draw.text((180, 360), 'Due Date:', fill='black')
draw.text((375, 360), '02/12/2023', fill='black')

img.save('test_invoice.png')
print('Test image created: test_invoice.png')
