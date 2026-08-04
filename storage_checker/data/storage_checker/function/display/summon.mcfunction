# ============================================
# Summon a text display above a container (macro function)
# Positioned at ~ ~ ~ (~0.5 ~1 ~0.5 relative to container)
# Called with: {type: <string>, count: <int>, item0: <string>, item1: <string>, item2: <string>, item3: <string>, item4: <string>}
# ============================================
$summon minecraft:text_display ~ ~ ~ {billboard:"center",shadow:1b,see_through:0b,Tags:["sd.marker"],transformation:{left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],translation:[0f,0f,0f],scale:[0.6f,0.6f,0.6f]},text:[{"bold":true,"color":"gold","text":"⚠ "},{"bold":true,"color":"white","text":"$(type)"},{"color":"gray","text":": "},{"bold":true,"color":"aqua","text":"$(count)"},{"color":"gray","text":" slot(s) with items\n"},{"color":"yellow","text":"$(item0)"},{"color":"yellow","text":"$(item1)"},{"color":"yellow","text":"$(item2)"},{"color":"yellow","text":"$(item3)"},{"color":"yellow","text":"$(item4)"}],background:1610612736}