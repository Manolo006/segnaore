# Get block coordinates via temp marker entity
summon minecraft:marker ~ ~ ~ {Tags:["sd.temp"]}
execute store result storage sd:data bx int 1 run data get entity @e[tag=sd.temp,limit=1] Pos[0]
execute store result storage sd:data by int 1 run data get entity @e[tag=sd.temp,limit=1] Pos[1]
execute store result storage sd:data bz int 1 run data get entity @e[tag=sd.temp,limit=1] Pos[2]
kill @e[tag=sd.temp]

# Extract non-blaze item IDs
data modify storage sd:data non_blaze_items set from storage sd:data items_check[].id

# Report to triggering player in chat
function storage_checker:trigger/report_found with storage sd:data
