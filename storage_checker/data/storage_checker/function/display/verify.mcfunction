# ============================================
# Verify that the container below this display still has non-blaze-rod items
# Runs as each text_display (sd.marker), at its position (~0.5 ~1 ~0.5)
# Container is at ~ ~-1 ~
# ============================================

# Copy Items and strip blaze_rod
data modify storage sd:data items_check set from block ~ ~-1 ~ Items
data remove storage sd:data items_check[{id:"minecraft:blaze_rod"}]

# If container below is a hopper or smoker and still has non-blaze-rod items, keep display
execute if block ~ ~-1 ~ minecraft:hopper if data storage sd:data items_check[0] run return 0
execute if block ~ ~-1 ~ minecraft:smoker if data storage sd:data items_check[0] run return 0

# Otherwise, remove display
kill @s
