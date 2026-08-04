scoreboard players set @s sd.toggle 1
execute at @s run kill @e[type=minecraft:text_display,tag=sd.marker,distance=..6]
tellraw @s [{"text":"[Storage Checker] ","color":"gold","bold":true},{"text":"Text display scanning: ","color":"gray"},{"text":"DISABLED","color":"red","bold":true}]
