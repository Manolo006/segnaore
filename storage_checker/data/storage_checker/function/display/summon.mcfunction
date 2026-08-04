# ============================================
# Summon a text display above a container (macro function)
# Called with: {count: <int>, type: <string>, items: <list>}
# ============================================
$summon minecraft:text_display ~ ~1 ~ {billboard:"center",shadow:1b,see_through:0b,Tags:["sd.marker"],transformation:{left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],translation:[0f,0f,0f],scale:[0.6f,0.6f,0.6f]},text:[{"bold":true,"color":"gold","text":"⚠ "},{"bold":true,"color":"white","text":"$(type)"},{"color":"gray","text":": "},{"bold":true,"color":"aqua","text":"$(count)"},{"color":"gray","text":" slot(s) with items\n"},{"color":"gray","text":"Items: "},{"bold":true,"color":"yellow","text":"$(items)"}],background:1610612736}