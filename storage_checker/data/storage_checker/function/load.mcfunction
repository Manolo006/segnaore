# ============================================
# Storage Checker - Load
# Initializes scoreboards and data storage
# ============================================

scoreboard objectives add sd.var dummy
scoreboard objectives add sd.cooldown dummy

data merge storage sd:data {count:0,type:""}

tellraw @a [{"text":"[Storage Checker] ","color":"gold","bold":true},{"text":"Datapack loaded! v1.0","color":"green"}]
