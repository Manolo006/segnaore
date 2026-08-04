# ============================================
# Summon a text display above a container (macro function)
# Called with: {count: <int>, type: <string>}
# ============================================
$summon minecraft:text_display ~ ~1 ~ {text:'[{"text":"⚠ ","color":"gold","bold":true},{"text":"$(type)","color":"white","bold":true},{"text":": ","color":"gray"},{"text":"$(count)","color":"aqua","bold":true},{"text":" slot(s) with items","color":"gray"}]',billboard:"center",Tags:["sd.marker"],shadow:1b,see_through:0b,background:1610612736,transformation:{left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],translation:[0f,0f,0f],scale:[0.6f,0.6f,0.6f]}}
