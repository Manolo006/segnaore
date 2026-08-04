# ============================================
# Storage Checker - Load
# Initializes scoreboards and data storage
# ============================================

scoreboard objectives add sd.var dummy
scoreboard objectives add sd.toggle dummy
scoreboard objectives add check_storage trigger
scoreboard objectives add toggle_storage trigger

data merge storage sd:data {count:0,type:""}

tellraw @a [{"text":"[Storage Checker] ","color":"gold","bold":true},{"text":"Datapack loaded! v1.2 - Use /trigger check_storage or /trigger toggle_storage","color":"green"}]
